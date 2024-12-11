import { WebSocketServer } from 'ws'
import { canvasSize } from '~/editor/settings'

const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' })

const canvasBuffer = new Uint8Array(canvasSize * canvasSize * 3)
const queue: Uint8Array[] = []

const updateUsers = () => {
  console.log(`Sending ${queue.length} packed pixels`)

  // Create package message with queued pixel changes
  const totalLength = queue.reduce((acc, change) => acc + change.length, 0)
  const packedMessage = new Uint8Array(totalLength)
  let offset = 0
  queue.forEach(change => {
    packedMessage.set(change, offset)
    offset += change.length
  })

  wss.clients.forEach(client => {
    client.send(packedMessage)
  })

  // Clear queue
  queue.length = 0
}

wss.on('connection', (ws) => {
  console.log('New User')

  ws.on('error', console.error)

  // On User update
  ws.on('message', (data) => {
    // unpack pixels from data
    // queue them to changes waiting to be broadcast
    const packedChanges = new Uint8Array(data as Buffer)
    console.log('Received packed pixels', packedChanges.length / 3)
    for (let i = 0; i < packedChanges.length; i += 3) {
      const packedPixel = packedChanges.slice(i, i + 3)
      queue.push(packedPixel)
    }
    // update `updateUsers()` to send clients only the changes they didn't do
    updateUsers()
  })
})