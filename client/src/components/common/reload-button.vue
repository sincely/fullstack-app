<script setup>
defineOptions({
  name: 'ReloadButton'
})

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <ButtonIcon tooltip-content="刷新页面">
    <icon-ant-design-reload-outlined :class="{ 'animate-spin animate-duration-750': loading }" />
  </ButtonIcon>
</template>
