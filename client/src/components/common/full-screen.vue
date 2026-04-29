<script setup>
defineOptions({
  name: 'FullScreen'
})

defineProps({
  full: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <ButtonIcon :key="String(full)" :tooltip-content="full ? '退出全屏' : '全屏'">
    <icon-gridicons-fullscreen-exit v-if="full" />
    <icon-gridicons-fullscreen v-else />
  </ButtonIcon>
</template>
