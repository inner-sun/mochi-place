import { Component } from 'solid-js'
import { PaletteProps } from '~/components/palette/palette.interfaces'
import styles from '~/components/palette/palette.module.scss'
import { colors } from '~/editor/colors'

const Palette: Component = () => {
  return (
    <div class={styles.palette}>
      {colors.map(color => (
        <button
          class={styles.color}
          style={{ background: color }}
        />
      ))}
    </div>
  )
}

export default Palette
