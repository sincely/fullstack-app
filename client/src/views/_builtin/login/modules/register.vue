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
  <a-form ref="formRef" :model="model" :rules="rules">
    <a-form-item name="phone">
      <a-input v-model:value="model.phone" size="large" :placeholder="'请输入手机号'" />
    </a-form-item>
    <a-form-item name="code">
      <div class="w-full flex-y-center gap-16px">
        <a-input v-model:value="model.code" size="large" :placeholder="'请输入验证码'" />
        <a-button size="large" :disabled="isCounting" :loading="loading" @click="getCaptcha(model.phone)">
          {{ label }}
        </a-button>
      </div>
    </a-form-item>
    <a-form-item name="password">
      <a-input-password v-model:value="model.password" size="large" :placeholder="'请输入密码'" />
    </a-form-item>
    <a-form-item name="confirmPassword">
      <a-input-password v-model:value="model.confirmPassword" size="large" :placeholder="'请再次输入密码'" />
    </a-form-item>
    <a-space direction="vertical" size="large" class="w-full">
      <a-button type="primary" block size="large" shape="round" @click="handleSubmit">
        {{ '确认' }}
      </a-button>
      <a-button block size="large" shape="round" @click="toggleLoginModule('pwd-login')">
        {{ '返回' }}
      </a-button>
    </a-space>
  </a-form>
</template>
