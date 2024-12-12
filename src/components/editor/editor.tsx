import { Component } from 'solid-js'
import { createStore } from 'solid-js/store'
import Canvas from '~/components/canvas/canvas'
import styles from '~/components/editor/editor.module.scss'
import Interface from '~/components/interface/interface'
import { colors } from '~/editor/colors'

export const [editorState, setEditor] = createStore({
  primaryColor: colors[1],
  secondaryColor: colors[0],
  size: 1
})

const Editor: Component = () => {
  return (
    <div class={styles.editor}>
      <Interface />
      <Canvas />
    </div>
  )
}

export default Editor
