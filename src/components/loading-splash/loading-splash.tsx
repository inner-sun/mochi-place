import { Component } from 'solid-js'
import styles from '~/components/loading-splash/loading-splash.module.scss'

const LoadingSplash: Component = () => {
  return (
    <div class={styles.loadingSplash}>
      Chargement
    </div>
  )
}

export default LoadingSplash
