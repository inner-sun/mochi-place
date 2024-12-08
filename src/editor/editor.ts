import Canvas from '~/editor/canvas'
import Pencil from '~/editor/pencil'
import Point from '~/editor/point'

export default class Editor{
  canvas: Canvas
  pencil: Pencil

  constructor(canvasElement: HTMLCanvasElement){
    this.pencil = new Pencil()
    this.canvas = new Canvas({
      canvasElement,
      editor: this
    })
    this.registerEventListeners()
    this.update()
  }

  onPointerMove(event: PointerEvent){
    const canvasRect = this.canvas.element.getBoundingClientRect()
    const pointerCoords = new Point(
      event.x - canvasRect.left,
      event.y - canvasRect.top
    )
    this.pencil.coords = pointerCoords
  }

  update(){
    this.canvas.draw()
    requestAnimationFrame(() => this.update())
  }

  registerEventListeners(){
    window.addEventListener('pointermove', (e) => this.onPointerMove(e))
  }
}