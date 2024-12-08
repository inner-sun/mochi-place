import { Component } from 'solid-js'
import styles from '~/components/canvas/canvas.module.scss'
import Editor from '~/editor/editor'

const Canvas: Component = () => {
  const onCanvasReady = (element: HTMLCanvasElement) => {
    new Editor(element)
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
