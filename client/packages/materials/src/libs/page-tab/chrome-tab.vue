<script setup>
import ChromeTabBg from './chrome-tab-bg.vue'
import style from './index.module.css'

defineOptions({
  name: 'ChromeTab'
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
    class=":soy: relative inline-flex cursor-pointer items-center justify-center gap-16px whitespace-nowrap px-24px py-6px -mr-18px"
    :class="[
      style['chrome-tab'],
      { [style['chrome-tab_dark']]: darkMode },
      { [style['chrome-tab_active']]: active },
      { [style['chrome-tab_active_dark']]: active && darkMode }
    ]"
  >
    <div class=":soy: pointer-events-none absolute left-0 top-0 h-full w-full -z-1" :class="[style['chrome-tab__bg']]">
      <ChromeTabBg />
    </div>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
    <div class=":soy: absolute right-7px h-16px w-1px bg-#1f2225" :class="[style['chrome-tab-divider']]"></div>
  </div>
</template>
