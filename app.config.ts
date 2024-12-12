import { defineConfig } from "@solidjs/start/config"
import solidSvg from 'vite-plugin-solid-svg'
import { undestructurePlugin } from 'babel-plugin-solid-undestructure'

export default defineConfig({
  server: {
    static: true,
  },
  vite() {
    return {
      build: {
        sourcemap: true
      },
      plugins: [
        ...undestructurePlugin('ts'),
        solidSvg({
          svgo: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false
                    },
                  },
                },
              ],
            }
          }
        }),
      ],
    }
  }
})
