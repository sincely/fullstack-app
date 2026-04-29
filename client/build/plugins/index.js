import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import progress from 'vite-plugin-progress'
import VueDevtools from 'vite-plugin-vue-devtools'

import { setupHtmlPlugin } from './html'
import { setupUnocss } from './unocss'
import { setupUnplugin } from './unplugin'
export function setupVitePlugins(viteEnv, buildTime) {
  const plugins = [
    vue({
      script: {
        defineModel: true
      }
    }),
    vueJsx(),
    VueDevtools(),

    setupUnocss(viteEnv),
    ...setupUnplugin(viteEnv),
    progress(),
    setupHtmlPlugin(buildTime)
  ]

  return plugins
}
