import { TbCaretDown } from 'solid-icons/tb'
import { Component } from 'solid-js'
import { editorState, setEditor } from '~/components/editor/editor'
import styles from '~/components/palette/palette.module.scss'
import { colors } from '~/editor/colors'
import { MOUSE } from '~/editor/controls'

const Palette: Component = () => {
  const onColorChange = (color: string) => (event: MouseEvent) => {
    event.preventDefault()
    if(event.button === MOUSE.LEFT){
      setEditor('primaryColor', color)
    }
    if(event.button === MOUSE.RIGHT){
      setEditor('secondaryColor', color)
    }
  }

  return (
    <div class={styles.palette}>
      {colors.map(color => (
        <div class={styles.colorContainer}>
          {color === editorState.primaryColor && (
            <TbCaretDown
              class={styles.colorState}
              color='white'
              fill={'white'}
              stroke-width={1}
            />
          )}
          {color === editorState.secondaryColor && (
            <TbCaretDown
              class={styles.colorState}
              color='white'
              stroke-width={1}
            />
          )}
          <button
            onContextMenu={onColorChange(color)}
            onClick={onColorChange(color)}
            class={styles.color}
            style={{ background: color }}
          />
        </div>
      ))}
    </div>
  )
}

export default Palette
