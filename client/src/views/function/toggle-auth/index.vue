<script setup>
import { useLoading } from '@sa/hooks'
import { computed, ref } from 'vue'

import { useAuth } from '@/hooks/business/auth'
import { useAppStore } from '@/store/modules/app'
import { useAuthStore } from '@/store/modules/auth'

const appStore = useAppStore()
const authStore = useAuthStore()
const { hasAuth } = useAuth()
const { loading, startLoading, endLoading } = useLoading()

const accounts = computed(() => [
  {
    key: 'super',
    label: '超级管理员',
    userName: 'Super',
    password: '123456'
  },
  {
    key: 'admin',
    label: '管理员',
    userName: 'Admin',
    password: '123456'
  },
  {
    key: 'user',
    label: '普通用户',
    userName: 'User',
    password: '123456'
  }
])
//  'super' | 'admin' | 'user'
const loginAccount = ref('super')

async function handleToggleAccount(account) {
  loginAccount.value = account.key

  startLoading()
  await authStore.login(account.userName, account.password, false)
  endLoading()
  appStore.reloadPage()
}
</script>

<template>
  <ASpace direction="vertical" :size="16">
    <ACard :title="'切换权限'" :bordered="false" size="small" class="card-wrapper">
      <ADescriptions layout="vertical" bordered size="small" :column="1">
        <ADescriptionsItem :label="'用户角色'">
          <ASpace>
            <ATag v-for="role in authStore.userInfo.roles" :key="role">{{ role }}</ATag>
          </ASpace>
        </ADescriptionsItem>
        <ADescriptionsItem ions-item :label="'切换账号'">
          <ASpace>
            <AButton
              v-for="account in accounts"
              :key="account.key"
              :loading="loading && loginAccount === account.key"
              :disabled="loading && loginAccount !== account.key"
              @click="handleToggleAccount(account)"
            >
              {{ account.label }}
            </AButton>
          </ASpace>
        </ADescriptionsItem>
      </ADescriptions>
    </ACard>
    <ACard :title="'权限钩子函数 `hasAuth`'" :bordered="false" size="small" class="card-wrapper">
      <ASpace>
        <AButton v-if="hasAuth('B_CODE1')">{{ '超级管理员可见' }}</AButton>
        <AButton v-if="hasAuth('B_CODE2')">{{ '管理员可见' }}</AButton>
        <AButton v-if="hasAuth('B_CODE3')">
          {{ '管理员和用户可见' }}
        </AButton>
      </ASpace>
    </ACard>
  </ASpace>
</template>
