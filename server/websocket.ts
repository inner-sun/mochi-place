import { WebSocketServer } from 'ws'
import { unpackPixel } from '~/editor/pixels'
import { canvasSize } from '~/editor/settings'
import { Canvas } from './canvas'

const startWebsocketServer = (canvas: Canvas) => {
  const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' })

  const queue: Uint8Array[] = []
  let isBroadcasting = false
  const broadcastingInterval = 1000

  const applyChanges = (changes: Uint8Array[]) => {
    changes.forEach(change => {
      const { x, y } = unpackPixel(change)

      const isOutofBounds = x < 0 || x >= canvasSize || y < 0 || y >= canvasSize
      if (!isOutofBounds) {
        const offset = (y * canvasSize + x) * 3
        canvas.buffer.set(change, offset)
      }
    })
    canvas.save()
  }

  const updateUsers = () => {
    console.log(`[WS] Sending ${queue.length} packed pixels`)

    // Lock broadcasting and create a copy of the queue
    isBroadcasting = true
    const processedQueue = structuredClone(queue)
    queue.length = 0

    // Apply changes to the canvas buffer
    applyChanges(processedQueue)

    // Create package message with queued pixel changes
    const totalLength = processedQueue.reduce((acc, change) => acc + change.length, 0)
    const packedMessage = new Uint8Array(totalLength)
    let offset = 0
    processedQueue.forEach(change => {
      packedMessage.set(change, offset)
      offset += change.length
    })

    wss.clients.forEach(client => {
      client.send(packedMessage)
    })

    isBroadcasting = false
  }

  // Broadcast if there are any changes
  setInterval(() => {
    if (queue.length > 0 && !isBroadcasting) {
      updateUsers()
    }
  }, broadcastingInterval)

  wss.on('connection', (ws) => {
    console.log('[WS] New User')

    ws.on('error', console.error)

    // On User update
    ws.on('message', (data) => {
      // unpack pixels from data
      // queue them to changes waiting to be broadcast
      const packedChanges = new Uint8Array(data as Buffer)
      console.log('[WS] Received packed pixels', packedChanges.length / 3)
      for (let i = 0; i < packedChanges.length; i += 3) {
        const packedPixel = packedChanges.slice(i, i + 3)
        queue.push(packedPixel)

        // Broadcast changes if queue length exceeds 256
        if (queue.length > 256) {
          updateUsers()
        }
      }
    })
  })
}


export {
  startWebsocketServer
}