import { TbCaretDown } from 'solid-icons/tb'
import { Component } from 'solid-js'
import { ManualProps } from '~/components/manual/manual.interfaces'
import styles from '~/components/manual/manual.module.scss'

const Manual: Component<ManualProps> = ({ setManual }) => {
  return (
    <div class={styles.manual}>
      <button
        class={styles.close}
        onClick={() => {
          setManual(false)
        }}
      >
        Fermer
      </button>
      
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
          <span class={styles.shortcut}>Clic Droit</span>
          Peindre la couleur secondaire 
          <TbCaretDown
            class={styles.symbol}
            color='white'
            stroke-width={1}
          />
        </li>
        <li>
          <span class={styles.shortcut}>Clic Molette</span>
          Deplacer la toile
        </li>
        <li>
          <span class={styles.shortcut}>Scroll</span>
          Zoom +/-
        </li>
      </ul>
    </div>
  )
}

export default Manual
