import { colors } from '~/editor/colors'
import { MOUSE } from '~/editor/controls'
import Point from '~/editor/point'

export default class Pencil{
  primaryColor: string
  secondaryColor: string
  size: number
  initialCoords: Point
  offsetCoords: Point
  coords: Point
  isDown: boolean
  activeKey: number

  constructor(){
    this.primaryColor = colors[1]
    this.secondaryColor = colors[0]
    this.size = 1
    this.initialCoords = new Point(0,0)
    this.offsetCoords = new Point(0,0)
    this.coords = new Point(0,0)
    this.isDown = false
    this.activeKey = MOUSE.LEFT
  }
}