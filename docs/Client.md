# Auth
Users must auth using Discord or Twitch login
# Queueing consecutive pixels
When users paint pixels they get added to a buffer that either gets sent :
- after `N` ms
- when the buffer size reaches `N` pixels
# Syncing canvas
Users will receive batched diffs from the server that they need to apply to their canvas. To simplify things, users will have eager validation on the client and then apply the diffs from the server.
That means that they will paint instantaneously on their canvas, then the diff will be received and applied, most of the time applying their own changes again.