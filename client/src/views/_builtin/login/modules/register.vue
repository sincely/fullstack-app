<script setup>
import { computed, reactive } from 'vue'

import { useCaptcha } from '@/hooks/business/captcha'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { useRouterPush } from '@/hooks/common/router'

defineOptions({
  name: 'CodeLogin'
})

const { toggleLoginModule } = useRouterPush()
const { formRef, validate } = useAntdForm()
const { label, isCounting, loading, getCaptcha } = useCaptcha()

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
    code: formRules.code,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  }
})

async function handleSubmit() {
  await validate()
  // 注册请求
  window.$message?.success('验证成功')
}
</script>

<template>
  <AForm ref="formRef" :model="model" :rules="rules">
    <AFormItem name="phone">
      <AInput v-model:value="model.phone" size="large" :placeholder="'请输入手机号'" />
    </AFormItem>
    <AFormItem name="code">
      <div class="w-full flex-y-center gap-16px">
        <AInput v-model:value="model.code" size="large" :placeholder="'请输入验证码'" />
        <AButton size="large" :disabled="isCounting" :loading="loading" @click="getCaptcha(model.phone)">
          {{ label }}
        </AButton>
      </div>
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
