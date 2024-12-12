import Point from '~/editor/point'

const MOUSE = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2
}

interface CanvasTransform{
  pan: Point
  zoom: number
}

class Controls{
  panning: boolean
  panToggle: boolean
  canvasTransform: CanvasTransform

  constructor(canvasElement: HTMLCanvasElement){
    this.canvasTransform = {
      pan: new Point(0, 0),
      zoom: 1
    }
    this.panning = false
    this.panToggle = false
  }
}

export {
  MOUSE,
  Controls
}