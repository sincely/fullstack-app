<script setup>
import Clipboard from 'clipboard'
import { onMounted, ref } from 'vue'

import { useThemeStore } from '@/store/modules/theme'

defineOptions({
  name: 'ConfigOperation'
})

const themeStore = useThemeStore()

const domRef = ref(null)

function initClipboard() {
  if (!domRef.value) return

  const clipboard = new Clipboard(domRef.value, {
    text: () => getClipboardText()
  })

  clipboard.on('success', () => {
    window.$message?.success('复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings')
  })
}

function getClipboardText() {
  const reg = /"\w+":/g

  const json = themeStore.settingsJson

  return json.replace(reg, (match) => match.replace(/"/g, ''))
}

function handleReset() {
  themeStore.resetStore()

  setTimeout(() => {
    window.$message?.success('重置成功')
  }, 50)
}

onMounted(() => {
  initClipboard()
})
</script>

<template>
  <div class="flex justify-between">
    <AButton danger @click="handleReset">重置配置</AButton>
    <div ref="domRef">
      <AButton type="primary">复制配置</AButton>
    </div>
  </div>
</template>
