<script setup>
import { fetchCustomBackendError } from '@/service/api'

async function logout() {
  await fetchCustomBackendError('8888', '用户状态失效，请重新登录')
}

async function logoutWithModal() {
  await fetchCustomBackendError('7777', '用户状态失效，请重新登录')
}

async function refreshToken() {
  await fetchCustomBackendError('9999', 'token已过期')
}
</script>

<template>
  <a-space direction="vertical" :size="16">
    <a-card :title="'请求失败后登出用户'" :bordered="false" size="small" class="card-wrapper">
      <a-button @click="logout">{{ '触发' }}</a-button>
    </a-card>
    <a-card :title="'请求失败后弹出模态框再登出用户'" :bordered="false" size="small" class="card-wrapper">
      <a-button @click="logoutWithModal">{{ '触发' }}</a-button>
    </a-card>
    <a-card :title="'请求的token已过期，刷新token'" :bordered="false" size="small" class="card-wrapper">
      <a-button @click="refreshToken">{{ '触发' }}</a-button>
    </a-card>
  </a-space>
</template>
