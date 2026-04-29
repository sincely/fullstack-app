<script setup>
import { useFullscreen } from '@vueuse/core'
import { computed } from 'vue'

import { useAppStore } from '@/store/modules/app'
import { useRouteStore } from '@/store/modules/route'
import { useThemeStore } from '@/store/modules/theme'

import { useMixMenuContext } from '../../context'
import GlobalBreadcrumb from '../global-breadcrumb/index.vue'
import GlobalLogo from '../global-logo/index.vue'
import HorizontalMenu from '../global-menu/base-menu.vue'
import ThemeButton from './components/theme-button.vue'
import UserAvatar from './components/user-avatar.vue'

defineOptions({
  name: 'GlobalHeader'
})

defineProps({
  showLogo: {
    type: Boolean,
    default: true
  },
  showMenuToggler: {
    type: Boolean,
    default: true
  },
  showMenu: {
    type: Boolean,
    default: true
  }
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { isFullscreen, toggle } = useFullscreen()
const { menus } = useMixMenuContext()

const headerMenus = computed(() => {
  if (themeStore.layout.mode === 'horizontal') {
    return routeStore.menus
  }

  if (themeStore.layout.mode === 'horizontal-mix') {
    return menus.value
  }

  return []
})
</script>

<template>
  <DarkModeContainer class="h-full flex-y-center shadow-header">
    <GlobalLogo v-if="showLogo" class="h-full" :style="{ width: themeStore.sider.width + 'px' }" />
    <HorizontalMenu v-if="showMenu" mode="horizontal" :menus="headerMenus" class="px-12px" />
    <div v-else class="h-full flex-y-center flex-1-hidden">
      <MenuToggler v-if="showMenuToggler" :collapsed="appStore.siderCollapse" @click="appStore.toggleSiderCollapse" />
      <GlobalBreadcrumb v-if="!appStore.isMobile" class="ml-12px" />
    </div>
    <div class="h-full flex-y-center justify-end">
      <FullScreen v-if="!appStore.isMobile" :full="isFullscreen" @click="toggle" />
      <ThemeSchemaSwitch
        :theme-schema="themeStore.themeScheme"
        :is-dark="themeStore.darkMode"
        @switch="themeStore.toggleThemeScheme"
      />
      <ThemeButton />
      <UserAvatar />
    </div>
  </DarkModeContainer>
</template>
