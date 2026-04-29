<script setup>
import { Icon } from '@iconify/vue'
import { computed, useAttrs } from 'vue'

defineOptions({ name: 'SvgIcon', inheritAttrs: false })

/**
 * Props
 * - Support iconify and local svg icon
 * - If icon and localIcon are passed at the same time, localIcon will be rendered first
 */
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  localIcon: {
    type: String,
    default: ''
  }
})

const attrs = useAttrs()

const bindAttrs = computed(() => ({
  class: attrs.class || '',
  style: attrs.style || ''
}))

const symbolId = computed(() => {
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env

  const defaultLocalIcon = 'no-icon'

  const icon = props.localIcon || defaultLocalIcon

  return `#${prefix}-${icon}`
})

/** If localIcon is passed, render localIcon first */
const renderLocalIcon = computed(() => props.localIcon || !props.icon)
</script>

<template>
  <template v-if="renderLocalIcon">
    <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </template>
  <template v-else>
    <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
  </template>
</template>
