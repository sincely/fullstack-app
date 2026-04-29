<script setup>
import { SimpleScrollbar } from '@sa/materials'
import { transformColorWithOpacity } from '@sa/utils'
import { createReusableTemplate } from '@vueuse/core'
import { computed } from 'vue'

import { useAppStore } from '@/store/modules/app'
import { useRouteStore } from '@/store/modules/route'
import { useThemeStore } from '@/store/modules/theme'

defineOptions({
  name: 'FirstLevelMenu'
})

defineProps({
  activeMenuKey: {
    type: String,
    default: ''
  },
  inverted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()

const [DefineMixMenuItem, MixMenuItem] = createReusableTemplate({
  label: '',
  icon: '',
  active: false,
  isMini: false
})

const selectedBgColor = computed(() => {
  const { darkMode, themeColor } = themeStore

  const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff')
  const dark = transformColorWithOpacity(themeColor, 0.3, '#000000')

  return darkMode ? dark : light
})

function handleClickMixMenu(menu) {
  emit('select', menu)
}
</script>

<template>
  <!-- define component: MixMenuItem -->
  <DefineMixMenuItem v-slot="{ label, icon, active, isMini }">
    <div
      class="mx-4px mb-6px flex-col-center cursor-pointer rounded-8px bg-transparent px-4px py-8px transition-300 hover:bg-[rgb(0,0,0,0.08)]"
      :class="{
        'text-primary selected-mix-menu': active,
        'text-white:65 hover:text-white': inverted,
        '!text-white !bg-primary': active && inverted
      }"
    >
      <component :is="icon" :class="[isMini ? 'text-icon-small' : 'text-icon-large']" />
      <p
        class="w-full ellipsis-text text-center text-12px transition-height-300"
        :class="[isMini ? 'h-0 pt-0' : 'h-24px pt-4px']"
      >
        {{ label }}
      </p>
    </div>
  </DefineMixMenuItem>

  <!-- template -->
  <div class="h-full flex-col-stretch flex-1-hidden">
    <slot></slot>
    <SimpleScrollbar>
      <MixMenuItem
        v-for="menu in routeStore.menus"
        :key="menu.key"
        :label="menu.label"
        :icon="menu.icon"
        :active="menu.key === activeMenuKey"
        :is-mini="appStore.siderCollapse"
        @click="handleClickMixMenu(menu)"
      />
    </SimpleScrollbar>
    <MenuToggler
      arrow-icon
      :collapsed="appStore.siderCollapse"
      :class="{ 'text-white:88 !hover:text-white': inverted }"
      @click="appStore.toggleSiderCollapse"
    />
  </div>
</template>

<style scoped>
.selected-mix-menu {
  background-color: v-bind(selectedBgColor);
}
</style>
