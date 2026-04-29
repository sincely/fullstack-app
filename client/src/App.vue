<script setup>
import { ConfigProvider } from 'ant-design-vue'

import { antdLocale } from './locales/antd'
import { useThemeStore } from './store/modules/theme'

defineOptions({
  name: 'App'
})

const themeStore = useThemeStore()
</script>

<template>
  <ConfigProvider :theme="themeStore.antdTheme" :locale="antdLocale">
    <AppProvider>
      <RouterView class="bg-layout" />
    </AppProvider>
  </ConfigProvider>
</template>
