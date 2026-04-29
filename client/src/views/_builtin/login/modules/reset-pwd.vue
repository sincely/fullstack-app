<script setup>
import { computed, reactive } from 'vue'

import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'ResetPwd'
})

const { toggleLoginModule } = useRouterPush()
const { formRef, validate } = useAntdForm()

const model = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const rules = computed(() => {
  const { formRules, createConfirmPwdRule } = useFormRules()

  return {
    phone: formRules.phone,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  }
})

async function handleSubmit() {
  await validate()
  // 重置密码请求
  window.$message?.success('验证成功')
}
</script>

<template>
  <AForm ref="formRef" :model="model" :rules="rules">
    <AFormItem name="phone">
      <AInput v-model:value="model.phone" size="large" :placeholder="'请输入手机号'" />
    </AFormItem>
    <AFormItem name="code">
      <AInput v-model:value="model.code" size="large" :placeholder="'请输入验证码'" />
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword v-model:value="model.password" size="large" :placeholder="'请输入密码'" />
    </AFormItem>
    <AFormItem name="confirmPassword">
      <AInputPassword v-model:value="model.confirmPassword" size="large" :placeholder="'请再次输入密码'" />
    </AFormItem>
    <ASpace direction="vertical" size="large" class="w-full">
      <AButton type="primary" block size="large" shape="round" @click="handleSubmit">
        {{ '确认' }}
      </AButton>
      <AButton block size="large" shape="round" @click="toggleLoginModule('pwd-login')">
        {{ '返回' }}
      </AButton>
    </ASpace>
  </AForm>
</template>
