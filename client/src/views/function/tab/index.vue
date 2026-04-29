<script setup>
import { ref } from 'vue'

import { useRouterPush } from '@/hooks/common/router'
import { useTabStore } from '@/store/modules/tab'

const tabStore = useTabStore()
const { routerPushByKey } = useRouterPush()

const tabLabel = ref('')

function changeTabLabel() {
  tabStore.setTabLabel(tabLabel.value)
}

function resetTabLabel() {
  tabStore.resetTabLabel()
}
</script>

<template>
  <ASpace direction="vertical" :size="16">
    <ACard :title="'标签页操作'" :bordered="false" size="small" class="card-wrapper">
      <ADivider orientation="left">{{ '添加标签页' }}</ADivider>
      <AButton @click="routerPushByKey('about')">{{ '跳转到关于页面' }}</AButton>

      <ADivider orientation="left">{{ '关闭标签页' }}</ADivider>
      <ASpace :size="16">
        <AButton @click="tabStore.removeActiveTab">
          {{ '关闭当前标签页' }}
        </AButton>
        <AButton @click="tabStore.removeTabByRouteName('about')">
          {{ '关闭"关于"标签页' }}
        </AButton>
      </ASpace>

      <ADivider orientation="left">{{ '添加多标签页' }}</ADivider>
      <ASpace :size="16" wrap class="m-0!">
        <AButton @click="routerPushByKey('function_multi-tab')">
          {{ '跳转到多标签页页面' }}
        </AButton>
        <AButton @click="routerPushByKey('function_multi-tab', { query: { a: '1' } })">
          {{ '跳转到多标签页页面(带有查询参数)' }}
        </AButton>
      </ASpace>
    </ACard>
    <ACard :title="'标签页标题'" :bordered="false" size="small" class="card-wrapper">
      <ADivider orientation="left">{{ '修改标题' }}</ADivider>
      <AInputSearch v-model:value="tabLabel" :enter-button="'修改'" class="max-w-240px" @search="changeTabLabel" />

      <ADivider orientation="left">{{ '重置标题' }}</ADivider>
      <AButton @click="resetTabLabel">{{ '重置' }}</AButton>
    </ACard>
  </ASpace>
</template>
