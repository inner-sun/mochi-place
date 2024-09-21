import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' })

let toggleValue = false

const getToggleState = () => JSON.stringify({ toggleValue })

const updateUsers = () => {
  wss.clients.forEach(client => {
    client.send(getToggleState())
  })
}

wss.on('connection', function connection(ws) {
  console.log('New User')

  ws.on('error', console.error)

  // On new toggleValue from any users
  // -> Update server value
  // -> Notify users
  ws.on('message', function message(data) {
    const { toggleValue: receivedToggleValue } = JSON.parse(data.toString()) as { toggleValue: boolean }
    toggleValue = receivedToggleValue
    console.log({ toggleValue })
    updateUsers()
  })

  // Init new user with current toggleValue
  ws.send(getToggleState())
})