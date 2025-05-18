import { Canvas, CanvasRenderingContext2D } from 'canvas'
import { createImageData } from '~/editor/pixels'
import { canvasSize } from '~/editor/settings'

const createImage = (fileBuffer: Buffer, canvas: Canvas, context: CanvasRenderingContext2D) => {
  const packedPixels = new Uint8Array(fileBuffer)
  const imageData = createImageData(packedPixels, canvasSize)
  context.putImageData(imageData, 0, 0)
  return canvas.toBuffer()
}

export {
  createImage
}