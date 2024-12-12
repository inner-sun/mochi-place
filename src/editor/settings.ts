export const canvasSize = 256
export const isMobile = () => typeof navigator === 'undefined' ? false : (/Mobi/i.test(navigator.userAgent))