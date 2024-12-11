import Editor, { Change } from '~/editor/editor'

export class Socket{
  editor: Editor
  webSocket: WebSocket
  queue: Change[]

  constructor(editor: Editor){
    this.editor = editor
    this.webSocket = new WebSocket(import.meta.env.VITE_WEBSOCKET)
    this.queue = []

    this.registerListeners()
    this.loop()
  }

  getPackedMessage(changes: Change[]){
    // use pack pixel but for several pixels
    console.log(`Packing ${changes.length} changes`, changes)
    return new Uint8Array(1)
  }

  appendChange(change: Change){
    this.queue.push(change)
  }

  sendChanges(){
    const message = this.getPackedMessage(this.queue)
    this.webSocket.send(message)
    this.queue = []
    console.log("Websocket: Sending Update")
  }

  onReceive(event: MessageEvent){
    console.log('Websocket: Message', event)
    // apply all updates using
    // this.editor.queueChange
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
    this.webSocket.addEventListener('open', () => console.log('Websocket: Connected'))
    this.webSocket.addEventListener('message', (e) => this.onReceive(e))
  }
}