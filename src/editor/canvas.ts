import Point from '~/editor/point'

export default class Canvas{
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor(canvasElement: HTMLCanvasElement){
    this.canvas = canvasElement
    this.canvas.width = 512
    this.canvas.height = 512
    this.context = canvasElement.getContext('2d') as CanvasRenderingContext2D

    if(this.context){
      this.context.fillStyle = "white"
      this.context.fillRect(0, 0, canvasElement.width, canvasElement.height)

      this.registerEventListeners()
    }
  }

  draw(){
    this.context.fillStyle = "white"
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawPencilPreview(coords: Point){
    const size = 4
    this.draw()
    this.context.fillStyle = "black"
    this.context.fillRect(Math.floor(coords.x), Math.floor(coords.y), size, size)
  }

  onPointerMove(event: PointerEvent){
    const canvasRect = this.canvas.getBoundingClientRect()
    const pointerCoords = new Point(
      event.x - canvasRect.left,
      event.y - canvasRect.top
    )
    this.drawPencilPreview(pointerCoords)
  }

  registerEventListeners(){
    window.addEventListener('pointermove', (e) => this.onPointerMove(e))
  }
}