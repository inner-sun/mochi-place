import { Component } from 'solid-js'
import { LoadingSplashProps } from '~/components/loading-splash/loading-splash.interfaces'
import styles from '~/components/loading-splash/loading-splash.module.scss'

const LoadingSplash: Component<LoadingSplashProps> = ({ loading }) => {
  return (
    <div class={[styles.loadingSplash, loading && styles.show].join(' ')}>
      <img
        class={styles.logo}
        src='./assets/images/logo.png'
        alt=''
      />
      <span>MochiPlace</span>
    </div>
  )
}

export default LoadingSplash
