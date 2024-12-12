import { TbHelp } from 'solid-icons/tb'
import { Component, createSignal, Show } from 'solid-js'
import styles from '~/components/interface/interface.module.scss'
import Manual from '~/components/manual/manual'
import Palette from '~/components/palette/palette'

const Interface: Component = () => {
  const [showManual, setManual] = createSignal(true)

  const toggleManual = () => setManual(value => !value)
 
  return (
    <div class={styles.interface}>
      <header>
        <div class={styles.title}>
          <img
            class={styles.logo}
            src='/assets/images/logo.png'
            alt=''
          />
          <span>MochiPlace</span>
        </div>

        <Palette />

        <button
          class={styles.button}
          onClick={toggleManual}
        >
          <TbHelp class={styles.icon} />
        </button>
      </header>

      <Show when={showManual()}>
        <Manual setManual={setManual} />
      </Show>
    </div>
  )
}

export default Interface
