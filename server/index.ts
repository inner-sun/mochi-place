import http from 'node:http'
import { Canvas } from './canvas'
import { startWebsocketServer } from './websocket'

const canvas = new Canvas

startWebsocketServer(canvas)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/canvas') {
    res.writeHead(200, {
      ...headers,
      'Content-Type': 'application/octet-stream'
    })
    res.end(canvas.buffer)
  } else {
    res.writeHead(404, {
      ...headers,
      'Content-Type': 'text/plain'
    })
    res.end('Not Found')
  }
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`[API] Server is running on port ${PORT}`)
})