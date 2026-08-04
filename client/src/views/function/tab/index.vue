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
  <a-space direction="vertical" :size="16">
    <a-card :title="'标签页操作'" :bordered="false" size="small" class="card-wrapper">
      <a-divider orientation="left">{{ '添加标签页' }}</a-divider>
      <a-button @click="routerPushByKey('about')">{{ '跳转到关于页面' }}</a-button>

      <a-divider orientation="left">{{ '关闭标签页' }}</a-divider>
      <a-space :size="16">
        <a-button @click="tabStore.removeActiveTab">
          {{ '关闭当前标签页' }}
        </a-button>
        <a-button @click="tabStore.removeTabByRouteName('about')">
          {{ '关闭"关于"标签页' }}
        </a-button>
      </a-space>

      <a-divider orientation="left">{{ '添加多标签页' }}</a-divider>
      <a-space :size="16" wrap class="m-0!">
        <a-button @click="routerPushByKey('function_multi-tab')">
          {{ '跳转到多标签页页面' }}
        </a-button>
        <a-button @click="routerPushByKey('function_multi-tab', { query: { a: '1' } })">
          {{ '跳转到多标签页页面(带有查询参数)' }}
        </a-button>
      </a-space>
    </a-card>
    <a-card :title="'标签页标题'" :bordered="false" size="small" class="card-wrapper">
      <a-divider orientation="left">{{ '修改标题' }}</a-divider>
      <a-input-search v-model:value="tabLabel" :enter-button="'修改'" class="max-w-240px" @search="changeTabLabel" />

      <a-divider orientation="left">{{ '重置标题' }}</a-divider>
      <a-button @click="resetTabLabel">{{ '重置' }}</a-button>
    </a-card>
  </a-space>
</template>
