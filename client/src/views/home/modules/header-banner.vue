<script setup>
import { computed } from 'vue'

import { useAuthStore } from '@/store/modules/auth'

defineOptions({
  name: 'HeaderBanner'
})

const authStore = useAuthStore()

const statisticData = computed(() => [
  {
    id: 0,
    title: '项目数',
    value: '25'
  },
  {
    id: 1,
    title: '待办',
    value: '4/16'
  },
  {
    id: 2,
    title: '消息',
    value: '12'
  }
])
</script>

<template>
  <ACard :bordered="false" class="card-wrapper">
    <ARow :gutter="[16, 16]">
      <ACol :span="24" :md="18">
        <div class="flex-y-center">
          <div class="size-72px shrink-0 overflow-hidden rd-1/2">
            <img src="@/assets/imgs/soybean.jpg" class="size-full" />
          </div>
          <div class="pl-12px">
            <h3 class="text-18px font-semibold">
              {{ `早安，${authStore.userInfo.userName}, 今天又是充满活力的一天!` }}
            </h3>
            <p class="text-#999 leading-30px">
              {{ '今日多云转晴，20℃ - 25℃!' }}
            </p>
          </div>
        </div>
      </ACol>
      <ACol :span="24" :md="6">
        <ASpace class="w-full justify-end" :size="24">
          <AStatistic v-for="item in statisticData" :key="item.id" class="whitespace-nowrap" v-bind="item" />
        </ASpace>
      </ACol>
    </ARow>
  </ACard>
</template>
