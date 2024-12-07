import { Component } from 'solid-js'
import Canvas from '~/components/canvas/canvas'
import styles from '~/components/editor/editor.module.scss'

const Editor: Component = () => {
  return (
    <div class={styles.editor}>
      <Canvas />
    </div>
  )
}

export default Editor
