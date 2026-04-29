import { ref, toValue } from 'vue'

import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@/constants/reg'

export function useFormRules() {
  const patternRules = {
    userName: {
      pattern: REG_USER_NAME,
      message: '用户名格式不正确',
      trigger: 'change'
    },
    phone: {
      pattern: REG_PHONE,
      message: '手机号格式不正确',
      trigger: 'change'
    },
    pwd: {
      pattern: REG_PWD,
      message: '密码格式不正确，6-18位字符，包含字母、数字、下划线',
      trigger: 'change'
    },
    code: {
      pattern: REG_CODE_SIX,
      message: '验证码格式不正确',
      trigger: 'change'
    },
    email: {
      pattern: REG_EMAIL,
      message: '邮箱格式不正确',
      trigger: 'change'
    }
  }

  const formRules = {
    userName: [createRequiredRule('请输入用户名'), patternRules.userName],
    phone: [createRequiredRule('请输入手机号'), patternRules.phone],
    pwd: [createRequiredRule('请输入密码'), patternRules.pwd],
    code: [createRequiredRule('请输入验证码'), patternRules.code],
    email: [createRequiredRule('请输入邮箱'), patternRules.email]
  }

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule('不能为空')

  function createRequiredRule(message) {
    return {
      required: true,
      message
    }
  }

  /** create a rule for confirming the password */
  function createConfirmPwdRule(pwd) {
    const confirmPwdRule = [
      { required: true, message: '请输入确认密码' },
      {
        validator: (rule, value) => {
          if (value.trim() !== '' && value !== toValue(pwd)) {
            return Promise.reject(rule.message)
          }
          return Promise.resolve()
        },
        message: '两次输入密码不一致',
        trigger: 'change'
      }
    ]
    return confirmPwdRule
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createConfirmPwdRule
  }
}

export function useAntdForm() {
  const formRef = ref(null)

  async function validate() {
    await formRef.value?.validate()
  }

  function resetFields() {
    formRef.value?.resetFields()
  }

  return {
    formRef,
    validate,
    resetFields
  }
}
