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
  <a-modal v-model:open="visible" title="登录日志详情" width="600px" :footer="null">
    <a-spin :spinning="loading">
      <a-descriptions :column="2" bordered size="small">
        <a-descriptions-item :label="'日志ID'">
          {{ detail.id }}
        </a-descriptions-item>
        <a-descriptions-item :label="'用户ID'">
          {{ detail.userId }}
        </a-descriptions-item>
        <a-descriptions-item :label="'用户名'">
          {{ detail.username }}
        </a-descriptions-item>
        <a-descriptions-item :label="'登录方式'">
          {{ loginTypeMap[detail.loginType] || detail.loginType }}
        </a-descriptions-item>
        <a-descriptions-item :label="'IP地址'">
          {{ detail.ipAddress }}
        </a-descriptions-item>
        <a-descriptions-item :label="'登录地点'">
          {{ detail.location }}
        </a-descriptions-item>
        <a-descriptions-item :label="'浏览器'">
          {{ detail.browser }}
        </a-descriptions-item>
        <a-descriptions-item :label="'操作系统'">
          {{ detail.os }}
        </a-descriptions-item>
        <a-descriptions-item :label="'登录状态'">
          <template v-if="detail.status !== null">
            <a-tag :color="statusRecord[detail.status]?.color">
              {{ statusRecord[detail.status]?.text }}
            </a-tag>
          </template>
        </a-descriptions-item>
        <a-descriptions-item :label="'提示信息'">
          {{ detail.message }}
        </a-descriptions-item>
        <a-descriptions-item :label="'Session ID'" :span="2">
          {{ detail.sessionId }}
        </a-descriptions-item>
        <a-descriptions-item :label="'User Agent'" :span="2">
          <div class="break-all text-12px">{{ detail.userAgent }}</div>
        </a-descriptions-item>
        <a-descriptions-item :label="'登录时间'" :span="2">
          {{ detail.createTime }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
  </a-modal>
</template>
