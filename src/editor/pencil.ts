import Point from '~/editor/point'

export default class Pencil{
  color: string
  size: number
  initialCoords: Point
  offsetCoords: Point
  coords: Point
  isDown: boolean

  constructor(){
    this.color = 'black'
    this.size = 1
    this.initialCoords = new Point(0,0)
    this.offsetCoords = new Point(0,0)
    this.coords = new Point(0,0)
    this.isDown = false
  }
}