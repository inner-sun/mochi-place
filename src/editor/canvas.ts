export default class Canvas{
  constructor(canvasElement: HTMLCanvasElement){
    const context = canvasElement.getContext('2d')
    if(context){
      context.fillStyle = "white"
      context.fillRect(0, 0, canvasElement.width, canvasElement.height)
    }
  }
}