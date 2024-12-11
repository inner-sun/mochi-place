import { editorState } from '~/components/editor/editor'
import Canvas from '~/editor/canvas'
import { Controls, MOUSE } from '~/editor/controls'
import Pencil from '~/editor/pencil'
import Point from '~/editor/point'
import { Socket } from '~/editor/socket'

export const canvasSize = 32

export interface Change{
  coords: Point
  color: string
  size: number
}

export default class Editor{
  container: HTMLDivElement
  pencil: Pencil
  controls: Controls
  socket: Socket
  canvas: Canvas
  changes: Change[]

  constructor(canvasElement: HTMLCanvasElement){
    this.container = canvasElement.parentElement as HTMLDivElement
    this.pencil = new Pencil
    this.controls = new Controls(canvasElement)
    this.socket = new Socket(this)
    this.canvas = new Canvas({
      canvasElement,
      editor: this
    })
    this.changes = []
    this.registerEventListeners()
    this.init()
    this.update()
  }

  async fetchLatestSnapshot(){
    const query = await fetch(`${import.meta.env.VITE_API}/current-snapshot`)
    const data = await query.arrayBuffer()
    return new Uint8Array(data)
  }

  async init(){
    const packedPixels = await this.fetchLatestSnapshot()
    this.canvas.updateBuffer(packedPixels)
  }

  // TODO: Fix identic changes getting queued
  queueUserChange(change: Change){
    this.queueChange(change)
    this.socket.appendChange(change)
  }

  queueChange(change: Change){
    this.changes.push(change)
  }

  onPointerDown(event: PointerEvent){
    this.pencil.initialCoords.set(
      event.x,
      event.y
    )

    if(event.button === MOUSE.LEFT){
      this.pencil.isDown = true
      this.pencil.activeKey = MOUSE.LEFT
      this.queueUserChange({
        coords: this.pencil.coords,
        color: this.pencil.primaryColor,
        size: this.pencil.size
      })
    }

    if(event.button === MOUSE.RIGHT){
      this.pencil.isDown = true
      this.pencil.activeKey = MOUSE.RIGHT
      this.queueUserChange({
        coords: this.pencil.coords,
        color:  editorState.secondaryColor,
        size: this.pencil.size
      })
    }
    
    if(event.button === MOUSE.WHEEL){
      this.controls.panning = true
    }
  }

  onPointerUp(event: PointerEvent) {
    this.pencil.isDown = false
    this.pencil.activeKey = MOUSE.LEFT

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
      const colorToApply = this.pencil.activeKey === MOUSE.LEFT 
        ? this.pencil.primaryColor 
        : this.pencil.secondaryColor
      this.queueUserChange({
        coords: this.pencil.coords,
        color: colorToApply,
        size: this.pencil.size
      })
    }

    // If Panning, move canvas
    if(this.controls.panning){
      this.pencil.offsetCoords.set(
        event.x - this.pencil.initialCoords.x,
        event.y - this.pencil.initialCoords.y
      )
    }
  }

  onWheel(event: WheelEvent){
    event.preventDefault()
    if(event.ctrlKey){
      // Zoom
      const newZoom = this.controls.canvasTransform.zoom + (event.deltaY * -0.01)
      this.controls.canvasTransform.zoom = newZoom < 0.5 ? 0.5 : newZoom
    }else{
      // Touchpad panning
      this.controls.canvasTransform.pan.set(
        this.controls.canvasTransform.pan.x + event.deltaX,
        this.controls.canvasTransform.pan.y + event.deltaY
      )
    }
  }

  applyTransform(){
    const canvasOffset = new Point(
      this.controls.canvasTransform.pan.x + this.pencil.offsetCoords.x,
      this.controls.canvasTransform.pan.y + this.pencil.offsetCoords.y
    )
    this.container.style.transform = `scale(${this.controls.canvasTransform.zoom}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
  }

  update(){
    this.applyTransform()
    this.canvas.applyChanges(this.changes)
    this.changes = []
    this.canvas.draw()
    requestAnimationFrame(() => this.update())
  }

  registerEventListeners(){
    window.addEventListener('contextmenu', (e) => e.preventDefault())
    window.addEventListener('pointerdown', (e) => this.onPointerDown(e))
    window.addEventListener('pointerup', (e) => this.onPointerUp(e))
    window.addEventListener('pointermove', (e) => this.onPointerMove(e))
    window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false })
  }
}