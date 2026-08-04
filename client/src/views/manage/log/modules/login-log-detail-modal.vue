<script setup>
import { reactive, ref, watch } from 'vue'

import { fetchGetLoginLogDetail } from '@/service/api'

defineOptions({
  name: 'LoginLogDetailModal'
})

const visible = defineModel('visible', {
  default: false
})

const props = defineProps({
  logId: {
    type: Number,
    default: null
  }
})

const statusRecord = {
  1: { text: '成功', color: 'success' },
  0: { text: '失败', color: 'error' }
}

const loginTypeMap = {
  password: '密码登录',
  code: '验证码登录',
  sms: '短信登录'
}

const detail = reactive({
  id: null,
  userId: null,
  username: '',
  loginType: '',
  ipAddress: '',
  location: '',
  browser: '',
  os: '',
  userAgent: '',
  status: null,
  message: '',
  sessionId: '',
  createTime: ''
})

const loading = ref(false)

async function loadDetail() {
  if (!props.logId) return
  loading.value = true
  try {
    const { data, error } = await fetchGetLoginLogDetail(props.logId)
    if (!error && data) {
      Object.assign(detail, data)
    }
  } finally {
    loading.value = false
  }
}

watch(visible, (val) => {
  if (val && props.logId) {
    loadDetail()
  } else {
    // 关闭时重置
    Object.assign(detail, {
      id: null,
      userId: null,
      username: '',
      loginType: '',
      ipAddress: '',
      location: '',
      browser: '',
      os: '',
      userAgent: '',
      status: null,
      message: '',
      sessionId: '',
      createTime: ''
    })
  }
})
</script>

<template>
  <AModal v-model:open="visible" title="登录日志详情" width="600px" :footer="null">
    <ASpin :spinning="loading">
      <ADescriptions :column="2" bordered size="small">
        <ADescriptionsItem :label="'日志ID'">
          {{ detail.id }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'用户ID'">
          {{ detail.userId }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'用户名'">
          {{ detail.username }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'登录方式'">
          {{ loginTypeMap[detail.loginType] || detail.loginType }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'IP地址'">
          {{ detail.ipAddress }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'登录地点'">
          {{ detail.location }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'浏览器'">
          {{ detail.browser }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'操作系统'">
          {{ detail.os }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'登录状态'">
          <template v-if="detail.status !== null">
            <ATag :color="statusRecord[detail.status]?.color">
              {{ statusRecord[detail.status]?.text }}
            </ATag>
          </template>
        </ADescriptionsItem>
        <ADescriptionsItem :label="'提示信息'">
          {{ detail.message }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'Session ID'" :span="2">
          {{ detail.sessionId }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'User Agent'" :span="2">
          <div class="break-all text-12px">{{ detail.userAgent }}</div>
        </ADescriptionsItem>
        <ADescriptionsItem :label="'登录时间'" :span="2">
          {{ detail.createTime }}
        </ADescriptionsItem>
      </ADescriptions>
    </ASpin>
  </AModal>
</template>
