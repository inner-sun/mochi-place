import { WebSocketServer } from 'ws'
import { open, writeFile } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { unpackPixel } from '~/editor/pixels'
import { canvasSize } from '~/editor/settings'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' })

const canvasBuffer = new Uint8Array(canvasSize * canvasSize * 3)
const queue: Uint8Array[] = []
let isBroadcasting = false
const broadcastingInterval = 1000
const lastSnapshot = Date.now()

// If no snapshot, create an empty one
const folder = path.resolve(__dirname, '..', 'public')
const snapshotFile = `snapshot.bin`
const filePath = `${folder}/${snapshotFile}`
open(filePath, 'r', (error) => {
  if (error) {
    if (error.code === 'ENOENT') {
      writeFile(filePath, Buffer.from(canvasBuffer), error => console.error(error))
    }
    else {
      console.error(error)
    }
  }
})

const saveCanvas = async () => {
  const folder = path.resolve(__dirname, '..', 'public')

  // Update public snapshot
  const snapshotFile = `snapshot.bin`
  const filePath = `${folder}/${snapshotFile}`
  writeFile(filePath, Buffer.from(canvasBuffer), error => console.error(error))

  // If last snapshot is older then 5min, save an timestamped archive
  const now = Date.now()
  const maxDelay = 5 * 60 * 1000
  if(now - maxDelay > lastSnapshot){
    const snapshotArchiveFile = `snapshot-${now}.bin`
    const archiveFilePath = `${folder}/${snapshotArchiveFile}`
    writeFile(archiveFilePath, Buffer.from(canvasBuffer), error => console.error(error))
  }
}

const applyChanges = (changes: Uint8Array[]) => {
  changes.forEach(change => {
    const { x, y } = unpackPixel(change)
    const offset = (y * canvasSize + x) * 3
    canvasBuffer.set(change, offset)
  })
  saveCanvas()
}

const updateUsers = () => {
  console.log(`Sending ${queue.length} packed pixels`)

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

      // Broadcast changes if queue length exceeds 256
      if (queue.length > 256) {
        updateUsers()
      }
    }
  })
})


