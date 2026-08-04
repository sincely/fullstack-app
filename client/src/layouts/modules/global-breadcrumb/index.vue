<script setup>
import { createReusableTemplate } from '@vueuse/core'
import { useAttrs } from 'vue'

import { useRouterPush } from '@/hooks/common/router'
import { useRouteStore } from '@/store/modules/route'
import { useThemeStore } from '@/store/modules/theme'

defineOptions({
  name: 'GlobalBreadcrumb',
  inheritAttrs: false
})

const attrs = useAttrs()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { routerPushByKey } = useRouterPush()

const [DefineBreadcrumbContent, BreadcrumbContent] = createReusableTemplate({
  breadcrumb: {
    type: Object,
    required: true
  }
})

function handleClickMenu(key) {
  routerPushByKey(key)
}
</script>

<template>
  <!-- define component start: BreadcrumbContent -->
  <DefineBreadcrumbContent v-slot="{ breadcrumb }">
    <div class="i-flex-y-center align-middle">
      <component :is="breadcrumb.icon" v-if="themeStore.header.breadcrumb.showIcon" class="mr-4px text-icon" />
      {{ breadcrumb.label }}
    </div>
  </DefineBreadcrumbContent>
  <!-- define component end: BreadcrumbContent -->

  <a-breadcrumb v-if="themeStore.header.breadcrumb.visible" v-bind="attrs">
    <a-breadcrumb-item v-for="item in routeStore.breadcrumbs" :key="item.key">
      <BreadcrumbContent :breadcrumb="item" />

      <template v-if="item.children?.length" #overlay>
        <a-menu>
          <a-menu-item v-for="option in item.children" :key="option.key" @click="handleClickMenu(option.routeKey)">
            <BreadcrumbContent :breadcrumb="option" />
          </a-menu-item>
        </a-menu>
      </template>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
