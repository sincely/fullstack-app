import './plugins/assets'

import { createApp } from 'vue'

import App from './App.vue'
import { setupDayjs, setupIconifyOffline, setupLoading, setupNProgress } from './plugins'
import { setupRouter } from './router'
import { setupStore } from './store'

async function setupApp() {
  setupLoading()

  setupNProgress()

  setupIconifyOffline()

  setupDayjs()

  const app = createApp(App)

  setupStore(app)

  await setupRouter(app)

  app.mount('#app')
}

setupApp()
