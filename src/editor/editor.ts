import Canvas from '~/editor/canvas'
import Pencil from '~/editor/pencil'
import Point from '~/editor/point'

export interface Change{
  coords: Point
  color: string
  size: number
}

export default class Editor{
  canvas: Canvas
  pencil: Pencil
  changes: Change[]

  constructor(canvasElement: HTMLCanvasElement){
    this.pencil = new Pencil()
    this.canvas = new Canvas({
      canvasElement,
      editor: this
    })
    this.changes = []
    this.registerEventListeners()
    this.update()
  }

  onPointerDown(){
    this.pencil.isDown = true
    this.changes.push({
      coords: this.pencil.coords,
      color: this.pencil.color,
      size: this.pencil.size
    })
  }

  onPointerUp(){
    this.pencil.isDown = false
  }

  onPointerMove(event: PointerEvent) {
    // Update Pencil position
    const canvasRect = this.canvas.element.getBoundingClientRect()
    const pointerCoords = new Point(
      Math.floor((event.x - canvasRect.left) / canvasRect.width * this.canvas.element.width),
      Math.floor((event.y - canvasRect.top) / canvasRect.height * this.canvas.element.height)
    )
    this.pencil.coords = pointerCoords

    // If pointer is down, queue pixel changes
    if(this.pencil.isDown){
      this.changes.push({
        coords: this.pencil.coords,
        color: this.pencil.color,
        size: this.pencil.size
      })
    }
  }

  update(){
    this.canvas.applyChanges(this.changes)
    this.changes = []
    this.canvas.draw()
    requestAnimationFrame(() => this.update())
  }

  registerEventListeners(){
    window.addEventListener('pointerdown', () => this.onPointerDown())
    window.addEventListener('pointerup', () => this.onPointerUp())
    window.addEventListener('pointermove', (e) => this.onPointerMove(e))
  }
}