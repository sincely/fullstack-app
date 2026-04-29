<script setup>
import { computed } from 'vue'

import ButtonTab from './button-tab.vue'
import ChromeTab from './chrome-tab.vue'
import style from './index.module.css'
import { ACTIVE_COLOR, createTabCssVars } from './shared'
import SvgClose from './svg-close.vue'

defineOptions({
  name: 'PageTab'
})

const props = defineProps({
  mode: {
    type: String,
    default: 'chrome'
  },
  commonClass: {
    type: String,
    default: 'transition-all-300'
  },
  activeColor: {
    type: String,
    default: ACTIVE_COLOR
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])
const activeTabComponent = computed(() => {
  const { mode, chromeClass, buttonClass } = props
  // 改为js写法
  const tabComponentMap = {
    chrome: {
      component: ChromeTab,
      class: chromeClass
    },
    button: {
      component: ButtonTab,
      class: buttonClass
    }
  }

  return tabComponentMap[mode]
})

const cssVars = computed(() => createTabCssVars(props.activeColor))

const bindProps = computed(() => {
  const { chromeClass: _chromeCls, buttonClass: _btnCls, ...rest } = props

  return rest
})

function handleClose() {
  emit('close')
}
</script>

<template>
  <component :is="activeTabComponent.component" :class="activeTabComponent.class" :style="cssVars" v-bind="bindProps">
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <slot></slot>
    <template #suffix>
      <slot name="suffix">
        <SvgClose v-if="closable" :class="[style['svg-close']]" @click="handleClose" />
      </slot>
    </template>
  </component>
</template>
