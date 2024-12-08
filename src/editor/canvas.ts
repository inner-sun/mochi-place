import Editor from '~/editor/editor'
import Point from '~/editor/point'

interface CanvasProps{
  canvasElement: HTMLCanvasElement
  editor: Editor
}

export default class Canvas{
  element: HTMLCanvasElement
  context: CanvasRenderingContext2D
  editor: Editor

  constructor({ canvasElement, editor }: CanvasProps){
    this.editor = editor
    this.element = canvasElement
    this.element.width = 512
    this.element.height = 512
    this.context = canvasElement.getContext('2d') as CanvasRenderingContext2D
    this.draw()
  }

  draw(){
    this.context.fillStyle = "white"
    this.context.fillRect(0, 0, this.element.width, this.element.height)

    this.drawPencilPreview(this.editor.pencil.coords)
  }

  drawPencilPreview(coords: Point){
    console.log(coords)
    this.context.fillStyle = "black"
    this.context.fillRect(Math.floor(coords.x), Math.floor(coords.y), this.editor.pencil.size, this.editor.pencil.size)
  }
}