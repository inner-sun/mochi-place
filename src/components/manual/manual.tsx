import { TbCaretDown } from 'solid-icons/tb'
import { Component } from 'solid-js'
import styles from '~/components/manual/manual.module.scss'

const Manual: Component = () => {
  return (
    <div class={styles.manual}>
      <ul>
        <li>
          <span class={styles.shortcut}>Clic Gauche</span>
          Peindre la couleur principale 
          <TbCaretDown
            class={styles.symbol}
            color='white'
            fill={'white'}
            stroke-width={1}
          />
        </li>
        <li>
          <span class={styles.shortcut}>Clic Gauche</span>
          Peindre la couleur secondaire 
          <TbCaretDown
            class={styles.symbol}
            color='white'
            stroke-width={1}
          />
        </li>
        <li>
          <span class={styles.shortcut}>Ctrl+Scroll</span>
          Zoom +/-
        </li>
        <li>
          <span class={styles.shortcut}>Clic Molette</span>
          Deplacer la toile
        </li>
      </ul>
    </div>
  )
}

export default Manual
