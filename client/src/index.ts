(() => {
  let toggleValue = false

  // WebSocket logic
  const socket = new WebSocket("ws://192.168.1.19:8080")
  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data)
    const { toggleValue: receivedValue } = JSON.parse(event.data) as { toggleValue: boolean }
    toggleValue = receivedValue
    updateButton()
  })

  // Button Handler
  const buttonElement = document.querySelector('#toggle') as HTMLButtonElement

  const updateButton = () => {
    buttonElement.className = toggleValue ? 'active' : ''
    buttonElement.textContent = toggleValue ? 'ON' : 'OFF'
  }

  const toggleHandler = () => {
    toggleValue = !toggleValue
    socket.send(JSON.stringify({ toggleValue }))
    updateButton()
    console.log("Toggled to ", toggleValue)
  }

  buttonElement.addEventListener('click', toggleHandler)
})()