import { Component } from 'solid-js'
import styles from '~/components/interface/interface.module.scss'

const MobileInterface: Component = () => {
  return (
    <div class={styles.mobileInterface}>
      <header>
        <div class={styles.title}>
          <img
            class={styles.logo}
            src='./assets/images/logo.png'
            alt=''
          />
          <span>MochiPlace</span>
        </div>
      </header>
    </div>
  )
}

export default MobileInterface
