<script setup>
import { computed } from 'vue'

import { useRouterPush } from '@/hooks/common/router'

defineOptions({ name: 'ExceptionBase' })

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const { routerPushByKey } = useRouterPush()

const iconMap = {
  403: 'no-permission',
  404: 'not-found',
  500: 'service-error'
}

const icon = computed(() => iconMap[props.type])
</script>

<template>
  <div class="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
    <div class="flex text-400px text-primary">
      <SvgIcon :local-icon="icon" />
    </div>
    <AButton type="primary" @click="routerPushByKey('root')">返回首页</AButton>
  </div>
</template>
