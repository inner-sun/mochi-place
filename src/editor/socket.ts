import { colors } from '~/editor/colors'
import Editor from '~/editor/editor'
import { packPixel, unpackPixel } from '~/editor/pixels'
import Point from '~/editor/point'
import { Change } from '~/editor/types/changes'

export class Socket{
  editor: Editor
  webSocket: WebSocket
  queue: Uint8Array[]
  isOnline: null | boolean

  constructor(editor: Editor){
    this.editor = editor
    this.webSocket = new WebSocket(import.meta.env.VITE_WEBSOCKET)
    this.queue = []
    /*
      null: didnt connect yet
      true: server is up
      false: server is down, switch to read-only and retry every 1 minute
    */
    this.isOnline = null

    this.registerListeners()
    this.loop()
  }

  getPackedMessage(changes: Uint8Array[]){
    const totalLength = changes.reduce((acc, change) => acc + change.length, 0)
    const packedMessage = new Uint8Array(totalLength)
    let offset = 0

    changes.forEach(change => {
      packedMessage.set(change, offset)
      offset += change.length
    })

    return packedMessage
  }

  appendChange(change: Change){
    const packedPixels: Uint8Array[] = []
    const pencil = change
    const pencilOffset = pencil.size === 1 ? 0 : pencil.size / 2
    const startX = pencil.coords.x - pencilOffset
    const startY = pencil.coords.y - pencilOffset

    for (let y = startY; y < startY + pencil.size; y++) {
      for (let x = startX; x < startX + pencil.size; x++) {
        let colorIndex = colors.findIndex(color => color === change.color)
        if (colorIndex === -1) colorIndex = 0
        const packedPixel = packPixel(change.coords.x, change.coords.y, colorIndex)
        packedPixels.push(packedPixel)
      }
    }

    this.queue.push(...packedPixels)
  }

  sendChanges(){
    console.log(`Websocket: Sending ${this.queue.length} updates`)
    const message = this.getPackedMessage(this.queue)
    this.webSocket.send(message)
    this.queue = []
  }

  onOpen(){
    this.isOnline = true
  }

  async onReceive(event: MessageEvent){
    const data: Blob = event.data
    const buffer  = await data.arrayBuffer()
    const packedMessage = new Uint8Array(buffer)
    const count = packedMessage.length / 3
    const changes: Change[] = []
    
    for(let i = 0; i < count; i++){
      const index = 3 * i
      const packedPixel = packedMessage.slice(index, index + 3)
      const change = unpackPixel(packedPixel)
      changes.push({
        color: colors[change.colorIndex],
        coords: new Point(change.x, change.y),
        size: 1
      })
    }
    
    console.log(`Websocket: Received ${changes.length} updates`)
    this.editor.queueChange(changes)
  }

  retryConnection(){
    window.location.reload()
  }

  onError(event: Event){
    console.error(event)
  }

  onClose(event: Event){
    // Only trigger the WS close handler if the user *was* connected
    // This means the connection crashed
    // This avoids triggering onClose if the server isn't up at all
    if(this.isOnline){
      console.error(event)
      this.isOnline = false
      this.retryConnection()
    }
  }

  loop(){
    if(this.queue.length > 0){
      this.sendChanges()
    }
    setTimeout(() => {
      this.loop()
    }, 1000)
  }

  registerListeners(){
    this.webSocket.addEventListener('open', () => this.onOpen())
    this.webSocket.addEventListener('message', (e) => this.onReceive(e))
    this.webSocket.addEventListener('error', (e) => this.onError(e))
    this.webSocket.addEventListener('close', (e) => this.onClose(e))
  }
}