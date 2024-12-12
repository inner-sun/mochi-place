import { makePersisted } from '@solid-primitives/storage'
import { TbHelp } from 'solid-icons/tb'
import { Component, createSignal, Show } from 'solid-js'
import styles from '~/components/interface/interface.module.scss'
import MobileInterface from '~/components/interface/mobile-interface'
import Manual from '~/components/manual/manual'
import Palette from '~/components/palette/palette'
import { isMobile } from '~/editor/settings'

const Interface: Component = () => {
  const [showManual, setManual] = makePersisted(createSignal(true))

  const toggleManual = () => setManual(value => !value)
 
  return (
    <Show when={!isMobile()} fallback={<MobileInterface />}>
      <div class={styles.interface}>
        <header>
          <div class={styles.title}>
            <img
              class={styles.logo}
              src='./assets/images/logo.png'
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
    </Show>
  )
}

export default Interface
