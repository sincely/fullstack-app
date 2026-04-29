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
  <AForm ref="formRef" :model="model" :rules="rules">
    <AFormItem name="userName">
      <AInput v-model:value="model.userName" size="large" :placeholder="'请输入用户名'" />
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword v-model:value="model.password" size="large" :placeholder="'请输入密码'" />
    </AFormItem>
    <ASpace direction="vertical" size="large" class="w-full">
      <div class="flex-y-center justify-between">
        <ACheckbox>{{ '记住我' }}</ACheckbox>
        <AButton type="text" @click="toggleLoginModule('reset-pwd')">忘记密码？</AButton>
      </div>
      <AButton type="primary" block size="large" shape="round" :loading="authStore.loginLoading" @click="handleSubmit">
        确认
      </AButton>
      <div class="flex-y-center justify-between">
        <AButton class="h-34px flex-1" block @click="toggleLoginModule('code-login')">
          {{ loginModuleRecord['code-login'] }}
        </AButton>
        <div class="w-12px"></div>
        <AButton class="h-34px flex-1" block @click="toggleLoginModule('register')">
          {{ loginModuleRecord.register }}
        </AButton>
      </div>
    </ASpace>
  </AForm>
</template>
