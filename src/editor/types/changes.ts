import Point from '~/editor/point'

export interface Change{
  coords: Point
  color: string
  size: number
}