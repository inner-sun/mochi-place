import { Component } from 'solid-js'
import styles from '~/components/canvas/canvas.module.scss'
import CanvasHandler from '~/editor/canvas'

const Canvas: Component = () => {
  const onCanvasReady = (element: HTMLCanvasElement) => {
    new CanvasHandler(element)
  }

  return (
    <div class={styles.canvasContainer}>
      <div class={styles.canvasWrapper}>
        <canvas class={styles.canvas} ref={onCanvasReady} />
      </div>
    </div>
  )
}

export default Canvas
