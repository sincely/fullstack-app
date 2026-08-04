<script setup>
import { ConfigProvider } from 'ant-design-vue'
import { computed } from 'vue'

import { antdLocale } from './locales/antd'
import { useThemeStore } from './store/modules/theme'

defineOptions({
  name: 'App'
})

const themeStore = useThemeStore()

const watermarkProps = computed(() => {
  return {
    content: themeStore.watermark.text,
    width: 120,
    height: 120,
    font: {
      fontSize: 16
    },
    offset: [12, 60],
    rotate: -15,
    zIndex: 9999
  }
})
</script>

<template>
  <ConfigProvider :theme="themeStore.antdTheme" :locale="antdLocale">
    <AppProvider>
      <RouterView class="bg-layout" />
      <a-watermark
        v-if="themeStore.watermark.visible"
        v-bind="watermarkProps"
        class="pointer-events-none absolute-lt! size-full"
      />
    </AppProvider>
  </ConfigProvider>
</template>
