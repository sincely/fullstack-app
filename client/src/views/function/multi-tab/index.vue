<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useRouterPush } from '@/hooks/common/router'

const route = useRoute()
const { routerPushByKey } = useRouterPush()

const routeQuery = computed(() => JSON.stringify(route.query))
</script>

<template>
  <div>
    <LookForward>
      <div>
        <a-button @click="routerPushByKey('function_tab')">{{ '返回标签页功能页' }}</a-button>
        <div class="py-24px">{{ '路由参数' }}: {{ routeQuery }}</div>
      </div>
    </LookForward>
  </div>
</template>
