const colors = [
  '#FFF1E8',
  '#000000',
  '#FFCCAA',
  '#1D2B53',
  '#7E2553',
  '#008751',
  '#AB5236',
  '#5F574F',
  '#C2C3C7',
  '#FF004D',
  '#FFA300',
  '#FFEC27',
  '#00E436',
  '#29ADFF',
  '#83769C',
  '#FF77A8',
]

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return { r, g, b }
}

export {
  colors,
  hexToRgb
}