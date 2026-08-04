<script setup>
import { computed } from 'vue'

import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app'
import { useRouterPush } from '@/hooks/common/router'
import { useAppStore } from '@/store/modules/app'
import { useThemeStore } from '@/store/modules/theme'

import { useMenu, useMixMenuContext } from '../../../context'
import FirstLevelMenu from '../components/first-level-menu.vue'

defineOptions({
  name: 'HorizontalMixMenu'
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()
const { allMenus, childLevelMenus, activeFirstLevelMenuKey, setActiveFirstLevelMenuKey } = useMixMenuContext()
const { selectedKey } = useMenu()

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted)

function handleClickMenu(menuInfo) {
  const { key } = menuInfo

  routerPushByKeyWithMetaQuery(key)
}

function handleSelectMixMenu(menu) {
  setActiveFirstLevelMenuKey(menu.key)

  if (!menu.children?.length) {
    routerPushByKeyWithMetaQuery(menu.routeKey)
  }
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <a-menu
      mode="horizontal"
      :selected-keys="[selectedKey]"
      :items="childLevelMenus"
      class="horizontal-menu size-full transition-300 border-0!"
      :class="{ 'bg-container!': themeStore.darkMode }"
      :style="{ lineHeight: themeStore.header.height + 'px' }"
      @click="handleClickMenu"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <FirstLevelMenu
      :menus="allMenus"
      :active-menu-key="activeFirstLevelMenuKey"
      :inverted="inverted"
      :sider-collapse="appStore.siderCollapse"
      :dark-mode="themeStore.darkMode"
      :theme-color="themeStore.themeColor"
      @select="handleSelectMixMenu"
      @toggle-sider-collapse="appStore.toggleSiderCollapse"
    >
      <slot></slot>
    </FirstLevelMenu>
  </Teleport>
</template>

<style lang="scss" scoped></style>
