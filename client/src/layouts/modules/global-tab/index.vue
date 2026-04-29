<script setup>
import { PageTab } from '@sa/materials'
import { useElementBounding } from '@vueuse/core'
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import BetterScroll from '@/components/custom/better-scroll.vue'
import { useAppStore } from '@/store/modules/app'
import { useRouteStore } from '@/store/modules/route'
import { useTabStore } from '@/store/modules/tab'
import { useThemeStore } from '@/store/modules/theme'

import ContextMenu from './context-menu.vue'

defineOptions({
  name: 'GlobalTab'
})

const route = useRoute()
const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const tabStore = useTabStore()

const bsWrapper = ref()
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper)
const bsScroll = ref()
const tabRef = ref()

const TAB_DATA_ID = 'data-tab-id'

async function scrollToActiveTab() {
  await nextTick()
  if (!tabRef.value) return

  const { children } = tabRef.value

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i]

    const { value: tabId } = child.attributes[TAB_DATA_ID]

    if (tabId === tabStore.activeTabId) {
      const { left, width } = child.getBoundingClientRect()
      const clientX = left + width / 2

      setTimeout(() => {
        scrollByClientX(clientX)
      }, 50)

      break
    }
  }
}

function scrollByClientX(clientX) {
  const currentX = clientX - bsWrapperLeft.value
  const deltaX = currentX - bsWrapperWidth.value / 2

  if (bsScroll.value?.instance) {
    const { maxScrollX, x: leftX, scrollBy } = bsScroll.value.instance

    const rightX = maxScrollX - leftX
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX)

    scrollBy(update, 0, 300)
  }
}

function getContextMenuDisabledKeys(tabId) {
  const disabledKeys = []

  if (tabStore.isTabRetain(tabId)) {
    const homeDisable = ['closeCurrent', 'closeLeft']
    disabledKeys.push(...homeDisable)
  }

  return disabledKeys
}

async function handleCloseTab(tab) {
  await tabStore.removeTab(tab.id)
  await routeStore.reCacheRoutesByKey(tab.routeKey)
}

async function refresh() {
  appStore.reloadPage(500)
}

function init() {
  tabStore.initTabStore(route)
}

// 监听路由与激活标签变化
watch(
  () => route.fullPath,
  () => {
    tabStore.addTab(route)
  }
)
watch(
  () => tabStore.activeTabId,
  () => {
    scrollToActiveTab()
  }
)

// 初始化
init()
</script>

<template>
  <DarkModeContainer class="size-full flex-y-center px-16px shadow-tab">
    <div ref="bsWrapper" class="h-full flex-1-hidden">
      <BetterScroll ref="bsScroll" :options="{ scrollX: true, scrollY: false, click: appStore.isMobile }">
        <div
          ref="tabRef"
          class="h-full flex pr-18px"
          :class="[themeStore.tab.mode === 'chrome' ? 'items-end' : 'items-center gap-12px']"
        >
          <ContextMenu
            v-for="tab in tabStore.tabs"
            :key="tab.id"
            :tab-id="tab.id"
            :disabled-keys="getContextMenuDisabledKeys(tab.id)"
          >
            <PageTab
              :[TAB_DATA_ID]="tab.id"
              :mode="themeStore.tab.mode"
              :dark-mode="themeStore.darkMode"
              :active="tab.id === tabStore.activeTabId"
              :active-color="themeStore.themeColor"
              :closable="!tabStore.isTabRetain(tab.id)"
              @click="tabStore.switchRouteByTab(tab)"
              @close="handleCloseTab(tab)"
            >
              <template #prefix>
                <SvgIcon
                  :icon="tab.icon"
                  :local-icon="tab.localIcon"
                  class="inline-block align-text-bottom text-16px"
                />
              </template>
              <div class="max-w-240px ellipsis-text">{{ tab.label }}</div>
            </PageTab>
          </ContextMenu>
        </div>
      </BetterScroll>
    </div>
    <ReloadButton :loading="!appStore.reloadFlag" @click="refresh" />
    <FullScreen :full="appStore.fullContent" @click="appStore.toggleFullContent" />
  </DarkModeContainer>
</template>
