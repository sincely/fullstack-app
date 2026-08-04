<script setup>
import { computed } from 'vue'

import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app'
import { useRouterPush } from '@/hooks/common/router'
import { useAppStore } from '@/store/modules/app'
import { useRouteStore } from '@/store/modules/route'
import { useThemeStore } from '@/store/modules/theme'

import { useMenu, useMixMenuContext } from '../../../context'

defineOptions({
  name: 'ReversedHorizontalMixMenu'
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()
const {
  firstLevelMenus,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  isActiveFirstLevelMenuHasChildren
} = useMixMenuContext()
const { selectedKey } = useMenu()

function handleSelectMixMenu(menuInfo) {
  const { key } = menuInfo

  setActiveFirstLevelMenuKey(key)

  if (!isActiveFirstLevelMenuHasChildren.value) {
    routerPushByKeyWithMetaQuery(key)
  }
}

const openKeys = computed(() => {
  if (appStore.siderCollapse || !selectedKey.value) return []

  if (!selectedKey.value) return []

  return routeStore.getSelectedMenuKeyPath(selectedKey.value)
})

function handleClickMenu(menuInfo) {
  const { key } = menuInfo

  routerPushByKeyWithMetaQuery(key)
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <a-menu
      mode="horizontal"
      :selected-keys="[activeFirstLevelMenuKey]"
      :items="firstLevelMenus"
      class="horizontal-menu size-full transition-300 border-0!"
      :class="{ 'bg-container!': themeStore.darkMode }"
      :style="{ lineHeight: themeStore.header.height + 'px' }"
      @click="handleSelectMixMenu"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <a-menu
        mode="inline"
        :items="childLevelMenus"
        :selected-keys="[selectedKey]"
        :open-keys="openKeys"
        :inline-collapsed="appStore.siderCollapse"
        :inline-indent="18"
        class="size-full transition-300 border-0!"
        :class="{ 'bg-container!': themeStore.darkMode }"
        @click="handleClickMenu"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
