import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import dayjs from 'dayjs'
import { defineConfig, loadEnv, normalizePath } from 'vite'

import { createViteProxy, getBuildTime } from './build/config'
import { setupVitePlugins } from './build/plugins'

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd())

  const buildTime = getBuildTime()

  const globalScssPath = normalizePath(fileURLToPath(new URL('./src/styles/scss/global.scss', import.meta.url)))

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${globalScssPath}" as *;`
        }
      }
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    server: {
      host: '0.0.0.0',
      port: 9527,
      open: true,
      proxy: createViteProxy(viteEnv, configEnv.command === 'serve'),
      fs: {
        cachedChecks: false
      }
    },
    preview: {
      port: 9725
    },
    build: {
      reportCompressedSize: false,
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  }
})
