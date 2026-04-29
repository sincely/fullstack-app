<script setup>
import style from './index.module.css'

defineOptions({
  name: 'ButtonTab'
})

defineProps({
  active: Boolean,
  closable: Boolean,
  activeColor: {
    type: String,
    default: '#f1f1f1'
  },
  darkMode: Boolean,
  mode: {
    type: String,
    // 'button' | 'chrome';
    default: 'button'
  },
  commonClass: {
    type: String,
    default: ''
  },
  buttonClass: {
    type: String,
    default: ''
  },
  chromeClass: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    class=":soy: relative inline-flex cursor-pointer items-center justify-center gap-12px whitespace-nowrap border-1px rounded-4px border-solid px-12px py-4px"
    :class="[
      style['button-tab'],
      { [style['button-tab_dark']]: darkMode },
      { [style['button-tab_active']]: active },
      { [style['button-tab_active_dark']]: active && darkMode }
    ]"
  >
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </div>
</template>
