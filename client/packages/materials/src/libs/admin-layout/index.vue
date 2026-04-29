<script setup>
import { computed } from 'vue'

import style from './index.module.css'
// import type { AdminLayoutProps } from '../../types';
import { createLayoutCssVars, LAYOUT_MAX_Z_INDEX, LAYOUT_SCROLL_EL_ID } from './shared'

defineOptions({
  name: 'AdminLayout'
})

// const props = withDefaults(defineProps<AdminLayoutProps>(), {
//   mode: 'vertical',
//   scrollMode: 'content',
//   scrollElId: LAYOUT_SCROLL_EL_ID,
//   commonClass: 'transition-all-300',
//   fixedTop: true,
//   maxZIndex: LAYOUT_MAX_Z_INDEX,
//   headerVisible: true,
//   headerHeight: 56,
//   tabVisible: true,
//   tabHeight: 48,
//   siderVisible: true,
//   siderCollapse: false,
//   siderWidth: 220,
//   siderCollapsedWidth: 64,
//   footerVisible: true,
//   footerHeight: 48,
//   rightFooter: false
// });

const props = defineProps({
  mode: {
    type: String,
    default: 'vertical'
  },
  scrollMode: {
    type: String,
    default: 'content' // 'wrapper' | 'content';
  },
  scrollElId: {
    type: String,
    default: LAYOUT_SCROLL_EL_ID
  },
  commonClass: {
    type: String,
    default: 'transition-all-300'
  },
  fixedTop: {
    type: Boolean,
    default: true
  },
  maxZIndex: {
    type: Number,
    default: LAYOUT_MAX_Z_INDEX
  },
  headerVisible: {
    type: Boolean,
    default: true
  },
  headerHeight: {
    type: Number,
    default: 56
  },
  tabVisible: {
    type: Boolean,
    default: true
  },
  tabHeight: {
    type: Number,
    default: 48
  },
  siderVisible: {
    type: Boolean,
    default: true
  },
  siderCollapse: {
    type: Boolean,
    default: false
  },
  siderWidth: {
    type: Number,
    default: 220
  },
  siderCollapsedWidth: {
    type: Number,
    default: 64
  },
  footerVisible: {
    type: Boolean,
    default: true
  },
  footerHeight: {
    type: Number,
    default: 48
  },
  rightFooter: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  scrollWrapperClass: {
    type: String,
    default: ''
  },
  mobileSiderClass: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: ''
  },
  fullContent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:siderCollapse'])

const slots = defineSlots()

const cssVars = computed(() => createLayoutCssVars(props))

// config visible
const showHeader = computed(() => Boolean(slots.header) && props.headerVisible)
const showTab = computed(() => Boolean(slots.tab) && props.tabVisible)
const showSider = computed(() => !props.isMobile && Boolean(slots.sider) && props.siderVisible)
const showMobileSider = computed(() => props.isMobile && Boolean(slots.sider) && props.siderVisible)
const showFooter = computed(() => Boolean(slots.footer) && props.footerVisible)

// scroll mode
const isWrapperScroll = computed(() => props.scrollMode === 'wrapper')
const isContentScroll = computed(() => props.scrollMode === 'content')

// layout direction
const isVertical = computed(() => props.mode === 'vertical')
const isHorizontal = computed(() => props.mode === 'horizontal')

const fixedHeaderAndTab = computed(() => props.fixedTop || (isHorizontal.value && isWrapperScroll.value))

// css
const leftGapClass = computed(() => {
  if (!props.fullContent && showSider.value) {
    return props.siderCollapse ? style['left-gap_collapsed'] : style['left-gap']
  }

  return ''
})

const headerLeftGapClass = computed(() => (isVertical.value ? leftGapClass.value : ''))

const footerLeftGapClass = computed(() => {
  const condition1 = isVertical.value
  const condition2 = isHorizontal.value && isWrapperScroll.value && !props.fixedFooter
  const condition3 = Boolean(isHorizontal.value && props.rightFooter)

  if (condition1 || condition2 || condition3) {
    return leftGapClass.value
  }

  return ''
})

const siderPaddingClass = computed(() => {
  let cls = ''

  if (showHeader.value && !headerLeftGapClass.value) {
    cls += style['sider-padding-top']
  }
  if (showFooter.value && !footerLeftGapClass.value) {
    cls += ` ${style['sider-padding-bottom']}`
  }

  return cls
})

function handleClickMask() {
  emit('update:siderCollapse', true)
}
</script>

<template>
  <div class="relative h-full" :class="[props.commonClass]" :style="cssVars">
    <div
      :id="isWrapperScroll ? props.scrollElId : undefined"
      class="h-full flex flex-col"
      :class="[props.commonClass, props.scrollWrapperClass, { 'overflow-y-auto': isWrapperScroll }]"
    >
      <!-- Header -->
      <template v-if="showHeader">
        <header
          v-show="!props.fullContent"
          class="flex-shrink-0"
          :class="[
            style['layout-header'],
            props.commonClass,
            props.headerClass,
            headerLeftGapClass,
            { 'absolute top-0 left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="header"></slot>
        </header>
        <div
          v-show="!props.fullContent && fixedHeaderAndTab"
          class="flex-shrink-0 overflow-hidden"
          :class="[style['layout-header-placement']]"
        ></div>
      </template>

      <!-- Tab -->
      <template v-if="showTab">
        <div
          class="flex-shrink-0"
          :class="[
            style['layout-tab'],
            props.commonClass,
            props.tabClass,
            { 'top-0!': props.fullContent || !showHeader },
            leftGapClass,
            { 'absolute left-0 w-full': fixedHeaderAndTab }
          ]"
        >
          <slot name="tab"></slot>
        </div>
        <div
          v-show="props.fullContent || fixedHeaderAndTab"
          class="flex-shrink-0 overflow-hidden"
          :class="[style['layout-tab-placement']]"
        ></div>
      </template>

      <!-- Sider -->
      <template v-if="showSider">
        <aside
          v-show="!props.fullContent"
          class="absolute left-0 top-0 h-full"
          :class="[
            props.commonClass,
            props.siderClass,
            siderPaddingClass,
            props.siderCollapse ? style['layout-sider_collapsed'] : style['layout-sider']
          ]"
        >
          <slot name="sider"></slot>
        </aside>
      </template>

      <!-- Mobile Sider -->
      <template v-if="showMobileSider">
        <aside
          class="absolute left-0 top-0 h-full w-0 bg-white"
          :class="[
            props.commonClass,
            props.mobileSiderClass,
            style['layout-mobile-sider'],
            props.siderCollapse ? 'overflow-hidden' : style['layout-sider']
          ]"
        >
          <slot name="sider"></slot>
        </aside>
        <div
          v-show="!siderCollapse"
          class="absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.2)]"
          :class="[style['layout-mobile-sider-mask']]"
          @click="handleClickMask"
        ></div>
      </template>

      <!-- Main Content -->
      <main
        :id="isContentScroll ? props.scrollElId : undefined"
        class="flex flex-col flex-grow"
        :class="[props.commonClass, props.contentClass, leftGapClass, { 'overflow-y-auto': isContentScroll }]"
      >
        <slot></slot>
      </main>

      <!-- Footer -->
      <template v-if="showFooter">
        <footer
          v-show="!props.fullContent"
          class="flex-shrink-0"
          :class="[
            style['layout-footer'],
            props.commonClass,
            props.footerClass,
            footerLeftGapClass,
            { 'absolute left-0 bottom-0 w-full': props.fixedFooter }
          ]"
        >
          <slot name="footer"></slot>
        </footer>
        <div
          v-show="!props.fullContent && props.fixedFooter"
          class="flex-shrink-0 overflow-hidden"
          :class="[style['layout-footer-placement']]"
        ></div>
      </template>
    </div>
  </div>
</template>
