<script setup>
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app'
import { useRouterPush } from '@/hooks/common/router'
import { useRouteStore } from '@/store/modules/route'
import { useThemeStore } from '@/store/modules/theme'

import { useMenu } from '../../../context'

defineOptions({
  name: 'HorizontalMenu'
})

const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()
const { selectedKey } = useMenu()

function handleClickMenu(menuInfo) {
  const { key } = menuInfo

  routerPushByKeyWithMetaQuery(key)
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <a-menu
      mode="horizontal"
      :selected-keys="[selectedKey]"
      :items="routeStore.menus"
      class="horizontal-menu size-full transition-300 border-0!"
      :class="{ 'bg-container!': themeStore.darkMode }"
      :style="{ lineHeight: themeStore.header.height + 'px' }"
      @click="handleClickMenu"
    />
  </Teleport>
</template>

<style lang="scss" scoped></style>
