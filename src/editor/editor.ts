import Canvas from '~/editor/canvas'
import { Controls, MOUSE } from '~/editor/controls'
import Pencil from '~/editor/pencil'
import Point from '~/editor/point'

export interface Change{
  coords: Point
  color: string
  size: number
}

export default class Editor{
  pencil: Pencil
  controls: Controls
  canvas: Canvas
  changes: Change[]

  constructor(canvasElement: HTMLCanvasElement){
    this.pencil = new Pencil
    this.controls = new Controls(canvasElement)
    this.canvas = new Canvas({
      canvasElement,
      editor: this
    })
    this.changes = []
    this.registerEventListeners()
    this.update()
  }

  onPointerDown(event: PointerEvent){
    this.pencil.initialCoords.set(
      event.x,
      event.y
    )

    if(event.button === MOUSE.LEFT){
      this.pencil.isDown = true
      this.changes.push({
        coords: this.pencil.coords,
        color: this.pencil.color,
        size: this.pencil.size
      })
    }
    
    if(event.button === MOUSE.WHEEL){
      this.controls.panning = true
    }
  }

  onPointerUp(event: PointerEvent){
    if(event.button === MOUSE.LEFT){
      this.pencil.isDown = false
    }

    if(event.button === MOUSE.WHEEL){
      this.controls.panning = false
      this.controls.canvasTransform.pan.set(
        this.controls.canvasTransform.pan.x + this.pencil.offsetCoords.x,
        this.controls.canvasTransform.pan.y + this.pencil.offsetCoords.y
      )
    }
  }

  onPointerMove(event: PointerEvent) {
    // Update Pencil position
    const canvasRect = this.canvas.element.getBoundingClientRect()      
    this.pencil.coords.set(
      Math.floor((event.x - canvasRect.left) / canvasRect.width * this.canvas.element.width),
      Math.floor((event.y - canvasRect.top) / canvasRect.height * this.canvas.element.height)
    )

    // If pointer is down, queue pixel changes
    if(this.pencil.isDown){
      this.changes.push({
        coords: this.pencil.coords,
        color: this.pencil.color,
        size: this.pencil.size
      })
    }

    // If Panning, move canvas
    if(this.controls.panning){
      this.pencil.offsetCoords.set(
        event.x - this.pencil.initialCoords.x,
        event.y - this.pencil.initialCoords.y
      )
      const canvasOffset = new Point(
        this.controls.canvasTransform.pan.x + this.pencil.offsetCoords.x,
        this.controls.canvasTransform.pan.y + this.pencil.offsetCoords.y
      )
      this.canvas.element.parentElement.style.transform = `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
    }
  }

  update(){
    this.canvas.applyChanges(this.changes)
    this.changes = []
    this.canvas.draw()
    requestAnimationFrame(() => this.update())
  }

  registerEventListeners(){
    window.addEventListener('pointerdown', (e) => this.onPointerDown(e))
    window.addEventListener('pointerup', (e) => this.onPointerUp(e))
    window.addEventListener('pointermove', (e) => this.onPointerMove(e))
  }
}