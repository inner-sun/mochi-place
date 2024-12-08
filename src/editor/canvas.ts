import Editor, { Change } from '~/editor/editor'
import Point from '~/editor/point'

interface CanvasProps{
  canvasElement: HTMLCanvasElement
  editor: Editor
}

export default class Canvas{
  element: HTMLCanvasElement
  context: CanvasRenderingContext2D
  editor: Editor
  bufferCanvas: OffscreenCanvas
  bufferContext: OffscreenCanvasRenderingContext2D

  constructor({ canvasElement, editor }: CanvasProps){
    this.editor = editor
    this.element = canvasElement
    this.element.width = 32
    this.element.height = 32
    this.context = canvasElement.getContext('2d') as CanvasRenderingContext2D

    this.bufferCanvas = new OffscreenCanvas(this.element.width, this.element.height)
    this.bufferContext = this.bufferCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    // Initial draw
    this.bufferContext.fillStyle = "white"
    this.bufferContext.fillRect(0, 0, this.element.width, this.element.height)
  }

  getPencilFillRect(pencil: Change){
    return [
      pencil.coords.x - pencil.size / 2,
      pencil.coords.y - pencil.size / 2,
      pencil.size,
      pencil.size
    ]
  }

  applyChanges(changes: Change[]){
    changes.forEach(change => {
      this.bufferContext.fillStyle = change.color
      const pencil = change
      this.bufferContext.fillRect(
        pencil.coords.x - pencil.size / 2,
        pencil.coords.y - pencil.size / 2,
        pencil.size,
        pencil.size
      )
    })
  }

  drawBuffer(){
    this.context.drawImage(this.bufferCanvas, 0, 0)
  }

  drawPencilPreview(){
    this.context.fillStyle = this.editor.pencil.color
    const pencil = this.editor.pencil
    this.context.fillRect(
      pencil.coords.x - pencil.size / 2,
      pencil.coords.y - pencil.size / 2,
      pencil.size,
      pencil.size
    )
  }

  draw(){
    this.drawBuffer()
    this.drawPencilPreview()
  }
}