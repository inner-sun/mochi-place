import { Component } from 'solid-js'
import styles from '~/components/interface/interface.module.scss'
import Palette from '~/components/palette/palette'

const Interface: Component = () => {
  return (
    <div class={styles.interface}>
      <div class={styles.title}>
        <img
          class={styles.logo}
          src='/assets/images/logo.png'
          alt=''
        />
        <span>MochiPlace</span>
      </div>
      <Palette />
    </div>
  )
}

export default Interface
