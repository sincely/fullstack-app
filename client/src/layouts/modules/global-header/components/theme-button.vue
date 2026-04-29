<script setup>
import { useAppStore } from '@/store/modules/app'

defineOptions({
  name: 'ThemeButton'
})

const appStore = useAppStore()
</script>

<template>
  <ButtonIcon
    icon="majesticons:color-swatch-line"
    tooltip-content="主题配置"
    trigger-parent
    @click="appStore.openThemeDrawer"
  />
</template>
