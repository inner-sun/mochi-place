import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' })

let toggleValue = false

const getToggleState = () => JSON.stringify({ toggleValue })

const updateUsers = () => {
  wss.clients.forEach(client => {
    // client.send(getToggleState())
  })
}

wss.on('connection', (ws) => {
  console.log('New User')

  ws.on('error', console.error)

  // On User update
  ws.on('message', (data) => {
    // unpack pixels from data
    // queue them to changes waiting to be broadcast
    console.log('Receieved packed pixels', data)
    // update `updateUsers()` to send clients only the changes they didn't do
    updateUsers()
  })
})