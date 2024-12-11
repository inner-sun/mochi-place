const packPixel = (x: number, y: number, colorIndex: number) => {
  const packed = new Uint8Array(3)

  // Pack X coordinate (10 bits)
  packed[0] = (x >> 2) & 0xFF
  packed[1] = ((x & 0x03) << 6) | ((y >> 4) & 0x3F)

  // Pack Y coordinate (10 bits) and color index (4 bits)
  packed[2] = ((y & 0x0F) << 4) | (colorIndex & 0x0F)

  return packed
}

const generateUint8ArrayData = (width: number, height: number) => {
  const numPixels = width * height
  const data = new Uint8Array(numPixels * 3)

  for (let i = 0; i < numPixels; i++) {
    const x = i % width
    const y = Math.floor(i / width)
    const colorIndex = Math.floor(Math.random() * 16) // Random color index between 0 and 15
    const packedPixel = packPixel(x, y, colorIndex)
    data.set(packedPixel, i * 3)
  }

  return data
}

const randomCanvas = () => {
  return generateUint8ArrayData(32, 32)
}

export {
  packPixel,
  generateUint8ArrayData,
  randomCanvas
}