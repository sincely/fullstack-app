<script setup>
import { useAppStore } from '@/store/modules/app'
import { useRouteStore } from '@/store/modules/route'
import { useThemeStore } from '@/store/modules/theme'

defineOptions({
  name: 'GlobalContent'
})

defineProps({
  showPadding: {
    type: Boolean,
    default: true
  }
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      :name="themeStore.page.animateMode"
      mode="out-in"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-enter="appStore.setContentXScrollable(false)"
    >
      <KeepAlive :include="routeStore.cacheRoutes">
        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="route.path"
          :class="{ 'p-16px': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>
