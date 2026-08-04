<script setup>
import { computed, reactive } from 'vue'

import { loginModuleRecord } from '@/constants/app'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { useRouterPush } from '@/hooks/common/router'
import { useAuthStore } from '@/store/modules/auth'

defineOptions({
  name: 'PwdLogin'
})

const authStore = useAuthStore()
const { toggleLoginModule } = useRouterPush()
const { formRef, validate } = useAntdForm()

const model = reactive({
  userName: 'admin',
  password: '123456'
})

const rules = computed(() => {
  // 保持与其他登录模块一致，规则按需在 computed 内获取
  const { formRules } = useFormRules()

  return {
    userName: formRules.userName,
    password: formRules.pwd
  }
})

async function handleSubmit() {
  await validate()
  await authStore.login(model.userName, model.password)
}
</script>

<template>
  <a-form ref="formRef" :model="model" :rules="rules">
    <a-form-item name="userName">
      <a-input v-model:value="model.userName" size="large" :placeholder="'请输入用户名'" />
    </a-form-item>
    <a-form-item name="password">
      <a-input-password v-model:value="model.password" size="large" :placeholder="'请输入密码'" />
    </a-form-item>
    <a-space direction="vertical" size="large" class="w-full">
      <div class="flex-y-center justify-between">
        <a-checkbox>{{ '记住我' }}</a-checkbox>
        <a-button type="text" @click="toggleLoginModule('reset-pwd')">忘记密码？</a-button>
      </div>
      <a-button type="primary" block size="large" shape="round" :loading="authStore.loginLoading" @click="handleSubmit">
        确认
      </a-button>
      <div class="flex-y-center justify-between">
        <a-button class="h-34px flex-1" block @click="toggleLoginModule('code-login')">
          {{ loginModuleRecord['code-login'] }}
        </a-button>
        <div class="w-12px"></div>
        <a-button class="h-34px flex-1" block @click="toggleLoginModule('register')">
          {{ loginModuleRecord.register }}
        </a-button>
      </div>
    </a-space>
  </a-form>
</template>
