import { colors, hexToRgb } from '~/editor/colors'

const packPixel = (x: number, y: number, colorIndex: number) => {
  const packed = new Uint8Array(3)

  // Pack X coordinate (10 bits)
  packed[0] = (x >> 2) & 0xFF
  packed[1] = ((x & 0x03) << 6) | ((y >> 4) & 0x3F)

  // Pack Y coordinate (10 bits) and color index (4 bits)
  packed[2] = ((y & 0x0F) << 4) | (colorIndex & 0x0F)

  return packed
}

const unpackPixel = (packed: Uint8Array) => {
  const x = ((packed[0] & 0xFF) << 2) | ((packed[1] >> 6) & 0x03)
  const y = ((packed[1] & 0x3F) << 4) | ((packed[2] >> 4) & 0x0F)
  const colorIndex = packed[2] & 0x0F

  return { x, y, colorIndex }
}

const createImageData = (packedData: Uint8Array, canvasSize: number) => {
  const numPixels = canvasSize * canvasSize
  const imageArray = new Uint8ClampedArray(numPixels * 4)

  for (let i = 0; i < numPixels; i++) {
    const packedPixel = packedData.slice(i * 3, i * 3 + 3)
    const { colorIndex } = unpackPixel(packedPixel)
    const { r, g, b } = hexToRgb(colors[colorIndex])

    imageArray[i * 4 + 0] = r
    imageArray[i * 4 + 1] = g
    imageArray[i * 4 + 2] = b
    imageArray[i * 4 + 3] = 255 // Alpha channel (fully opaque)
  }

  return new ImageData(imageArray, canvasSize, canvasSize)
}

export {
  packPixel,
  unpackPixel,
  createImageData
}