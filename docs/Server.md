# Connections
Each user connects with a web socket connection and will send a message for each pixel they paint. Each message gets timestamped and stored in a buffer by the server.
The client [can send a batch of messages at once](Client.md#Queueing%20consecutive%20pixels) to avoid spamming the server.
# Batched updates
The server regularly groups these messages and sends them to all the connected users to keep them in sync and allow them to update their client side canvas.
In order to save the progress and give the canvas to a new client coming on, the server regularly accumulates the pixel messages it received, and applies them to the global canvas, and saves it.
# Initialising new users
A new user receives the latest canvas and the messages that didn't get batched into the last global canvas version.