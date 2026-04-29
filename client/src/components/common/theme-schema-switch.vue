<script setup>
import { computed } from 'vue'

defineOptions({ name: 'ThemeSchemaSwitch' })

const props = defineProps({
  themeSchema: {
    type: String,
    default: 'light'
  },
  showTooltip: {
    type: Boolean,
    default: true
  },
  tooltipPlacement: {
    type: String,
    default: 'top'
  }
})

const emit = defineEmits(['switch'])

function handleSwitch() {
  emit('switch')
}

const icons = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
}

const icon = computed(() => icons[props.themeSchema])

const tooltipContent = computed(() => {
  if (!props.showTooltip) return ''

  return '主题模式'
})
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch"
  />
</template>
