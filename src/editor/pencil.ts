import Point from '~/editor/point'

export default class Pencil{
  color: string
  size: number
  coords: Point

  constructor(){
    this.color = 'black'
    this.size = 4
    this.coords = new Point(0,0)
  }
}