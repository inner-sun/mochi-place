import { colors } from '~/editor/colors'
import { MOUSE } from '~/editor/controls'
import Editor from '~/editor/editor'
import { createImageData, packPixel } from '~/editor/pixels'
import { canvasSize } from '~/editor/settings'
import { Change } from '~/editor/types/changes'

interface CanvasProps{
  canvasElement: HTMLCanvasElement
  editor: Editor
}

export default class Canvas{
  element: HTMLCanvasElement
  context: CanvasRenderingContext2D
  editor: Editor
  buffer: Uint8Array
  bufferCanvas: OffscreenCanvas
  bufferContext: OffscreenCanvasRenderingContext2D

  constructor({ canvasElement, editor }: CanvasProps){
    this.editor = editor
    this.element = canvasElement
    this.element.width = canvasSize
    this.element.height = canvasSize
    this.context = canvasElement.getContext('2d') as CanvasRenderingContext2D

    const numPixels = canvasSize * canvasSize
    this.buffer = new Uint8Array(numPixels * 3)
    this.bufferCanvas = new OffscreenCanvas(this.element.width, this.element.height)
    this.bufferContext = this.bufferCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    // Initial draw
    this.bufferContext.fillStyle = colors[0]
    this.bufferContext.fillRect(0, 0, this.element.width, this.element.height)
  }

  getImageData(buffer: Uint8Array){
    const imageData = createImageData(buffer, canvasSize)
    return imageData
  }

  updateBuffer(buffer: Uint8Array){
    this.buffer.set(buffer)
    this.drawBuffer()
  }

  getPencilFillRect(pencil: Change){
    return [
      pencil.coords.x - pencil.size / 2,
      pencil.coords.y - pencil.size / 2,
      pencil.size,
      pencil.size
    ]
  }

  applyChanges(changes: Change[]) {
    changes.forEach(change => {
      const pencil = change
      const pencilOffset = pencil.size === 1 ? 0 : pencil.size / 2
      const startX = pencil.coords.x - pencilOffset
      const startY = pencil.coords.y - pencilOffset

      for (let y = startY; y < startY + pencil.size; y++) {
        for (let x = startX; x < startX + pencil.size; x++) {
          const isOutOfBounds = x < 0 || x >= canvasSize || y < 0 || y >= canvasSize
          if (!isOutOfBounds) {
            const index = (y * canvasSize + x) * 3
            let colorIndex = colors.findIndex(color => color === change.color)
            if (colorIndex === -1) colorIndex = 0
            const packedPixel = packPixel(change.coords.x, change.coords.y, colorIndex)
            this.buffer.set(packedPixel, index)
          }
        }
      }
    })
  }

  drawBuffer(){
    const imageData = this.getImageData(this.buffer)
    this.bufferContext.putImageData(imageData, 0, 0)
    this.context.drawImage(this.bufferCanvas, 0, 0)
  }

  drawPencilPreview(){
    const colorToPreview = this.editor.pencil.activeKey === MOUSE.LEFT
      ? this.editor.pencil.primaryColor
      : this.editor.pencil.secondaryColor
    this.context.fillStyle = colorToPreview
    const pencil = this.editor.pencil
    const pencilOffset = pencil.size === 1 ? 0 : pencil.size / 2
    this.context.fillRect(
      pencil.coords.x - pencilOffset,
      pencil.coords.y - pencilOffset,
      pencil.size,
      pencil.size
    )
  }

  draw(){
    this.drawBuffer()
    this.drawPencilPreview()
  }
}