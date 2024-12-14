import { Canvas } from './canvas'
import { startWebsocketServer } from './websocket'
import { startApiServer } from './api'
import { Status } from '~/editor/types/status'

const status: Status = { readOnly: false, players: 0 }
const canvas = new Canvas

startWebsocketServer(canvas, status)
startApiServer(canvas, status)