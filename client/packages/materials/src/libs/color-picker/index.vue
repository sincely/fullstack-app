<script setup>
import '@simonwep/pickr/dist/themes/nano.min.css'

import ColorPicker from '@simonwep/pickr'
import { onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'ColorPicker'
})

const props = defineProps({
  color: {
    type: String,
    required: true
  },
  palettes: {
    type: Array,
    default: () => [
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#a855f7',
      '#0ea5e9',
      '#06b6d4',
      '#f43f5e',
      '#ef4444',
      '#ec4899',
      '#d946ef',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#10b981',
      '#14b8a6'
    ]
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:color'])

const domRef = ref(null)
const instance = ref(null)

function handleColorChange(hsva) {
  const color = hsva.toHEXA().toString()
  emit('update:color', color)
}

function initColorPicker() {
  if (!domRef.value) return

  instance.value = ColorPicker.create({
    el: domRef.value,
    theme: 'nano',
    swatches: props.palettes,
    lockOpacity: true,
    default: props.color,
    disabled: props.disabled,
    components: {
      preview: true,
      opacity: false,
      hue: true,
      interaction: {
        hex: true,
        rgba: true,
        input: true
      }
    }
  })

  instance.value.on('change', handleColorChange)
}

function updateColor(color) {
  if (!instance.value) return

  instance.value.setColor(color)
}

function updateDisabled(disabled) {
  if (!instance.value) return

  if (disabled) {
    instance.value.disable()
  } else {
    instance.value.enable()
  }
}

watch(
  () => props.color,
  (value) => {
    updateColor(value)
  }
)

watch(
  () => props.disabled,
  (value) => {
    updateDisabled(value)
  }
)

onMounted(() => {
  initColorPicker()
})
</script>

<template>
  <div ref="domRef"></div>
</template>
