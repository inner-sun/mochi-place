import { Component, createEffect } from 'solid-js'
import styles from '~/components/canvas/canvas.module.scss'
import { editorState } from '~/components/editor/editor'
import Editor from '~/editor/editor'

const Canvas: Component = () => {
  let editor!: Editor
  const onCanvasReady = (element: HTMLCanvasElement) => {
    editor = new Editor(element)
  }

  createEffect(() => {
    editor.pencil.primaryColor = editorState.primaryColor
    editor.pencil.secondaryColor = editorState.secondaryColor
  })

  return (
    <div class={styles.canvasContainer}>
      <div class={styles.canvasWrapper}>
        <canvas class={styles.canvas} ref={onCanvasReady} />
      </div>
    </div>
  )
}

export default Canvas
