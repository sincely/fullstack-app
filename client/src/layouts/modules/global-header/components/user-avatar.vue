<script setup>
import { Modal } from 'ant-design-vue'

import { useRouterPush } from '@/hooks/common/router'
import { fetchLogout } from '@/service/api'
import { useAuthStore } from '@/store/modules/auth'

defineOptions({
  name: 'UserAvatar'
})

const authStore = useAuthStore()
const { routerPushByKey, toLogin } = useRouterPush()

function loginOrRegister() {
  toLogin()
}

async function logout() {
  Modal.confirm({
    title: '提示',
    content: '确认退出登录吗？',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await fetchLogout()
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        authStore.resetStore()
      }
    }
  })
}
</script>

<template>
  <AButton v-if="!authStore.isLogin" @click="loginOrRegister">登录 / 注册</AButton>
  <ADropdown v-else placement="bottomRight" trigger="click">
    <ButtonIcon>
      <SvgIcon icon="ph:user-circle" class="text-icon-large" />
      <span class="text-16px font-medium">{{ authStore.userInfo.userName }}</span>
    </ButtonIcon>
    <template #overlay>
      <AMenu>
        <AMenuItem @click="routerPushByKey('user-center')">
          <div class="flex-center gap-8px">
            <SvgIcon icon="ph:user-circle" class="text-icon" />
            个人中心
          </div>
        </AMenuItem>
        <AMenuDivider />
        <AMenuItem @click="logout">
          <div class="flex-center gap-8px">
            <SvgIcon icon="ph:sign-out" class="text-icon" />
            退出登录
          </div>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>
