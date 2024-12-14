import http from 'node:http'
import { Status } from '~/editor/types/status'
import { Canvas } from './canvas'

const startApiServer = (canvas: Canvas, status: Status) => {
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
    } else if (req.method === 'GET' && req.url === '/api/status') {
      res.writeHead(200, {
        ...headers,
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify(status))
    } else if (req.method === 'POST' && req.url === '/api/status') {
      let body = ''

      req.on('data', chunk => {
        body += chunk.toString()
      })

      req.on('end', () => {
        try{
          const payload = JSON.parse(body)
          if (process.env.API_KEY && payload.password === process.env.API_KEY) {
            status.readOnly = payload.readOnly
          }
          res.writeHead(200, {
            ...headers,
            'Content-Type': 'application/json'
          })
          res.end(JSON.stringify({ status }))
        }catch{
          res.writeHead(400)
          res.end()
        }
      })
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
}

export {
  startApiServer
}