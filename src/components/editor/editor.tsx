import { Component } from 'solid-js'
import Canvas from '~/components/canvas/canvas'
import styles from '~/components/editor/editor.module.scss'
import Palette from '~/components/palette/palette'

const Editor: Component = () => {
  return (
    <div class={styles.editor}>
      <Palette />
      <Canvas />
    </div>
  )
}

export default Editor
