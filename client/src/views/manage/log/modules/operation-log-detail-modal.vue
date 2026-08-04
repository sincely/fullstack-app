<script setup>
import { reactive, ref, watch } from 'vue'

import { fetchGetOperationLogDetail } from '@/service/api'

defineOptions({
  name: 'OperationLogDetailModal'
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

const detail = reactive({
  id: null,
  userId: null,
  username: '',
  action: '',
  module: '',
  method: '',
  requestUrl: '',
  requestParams: null,
  responseStatus: '',
  responseMsg: '',
  responseBody: null,
  ipAddress: '',
  userAgent: '',
  executeTime: null,
  status: null,
  createTime: ''
})

const loading = ref(false)

async function loadDetail() {
  if (!props.logId) return
  loading.value = true
  try {
    const { data, error } = await fetchGetOperationLogDetail(props.logId)
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
    Object.assign(detail, {
      id: null,
      userId: null,
      username: '',
      action: '',
      module: '',
      method: '',
      requestUrl: '',
      requestParams: null,
      responseStatus: '',
      responseMsg: '',
      responseBody: null,
      ipAddress: '',
      userAgent: '',
      executeTime: null,
      status: null,
      createTime: ''
    })
  }
})
</script>

<template>
  <a-modal v-model:open="visible" title="操作日志详情" width="700px" :footer="null">
    <a-spin :spinning="loading">
      <a-descriptions :column="2" bordered size="small">
        <a-descriptions-item :label="'日志ID'">
          {{ detail.id }}
        </a-descriptions-item>
        <a-descriptions-item :label="'操作用户'">
          {{ detail.username }}
        </a-descriptions-item>
        <a-descriptions-item :label="'操作类型'">
          {{ detail.action }}
        </a-descriptions-item>
        <a-descriptions-item :label="'系统模块'">
          {{ detail.module }}
        </a-descriptions-item>
        <a-descriptions-item :label="'请求方法'">
          {{ detail.method }}
        </a-descriptions-item>
        <a-descriptions-item :label="'请求URL'">
          {{ detail.requestUrl }}
        </a-descriptions-item>
        <a-descriptions-item :label="'IP地址'">
          {{ detail.ipAddress }}
        </a-descriptions-item>
        <a-descriptions-item :label="'执行时间'">
          <template v-if="detail.executeTime !== null">
            {{ detail.executeTime }}ms
          </template>
        </a-descriptions-item>
        <a-descriptions-item :label="'状态'">
          <template v-if="detail.status !== null">
            <a-tag :color="statusRecord[detail.status]?.color">
              {{ statusRecord[detail.status]?.text }}
            </a-tag>
          </template>
        </a-descriptions-item>
        <a-descriptions-item :label="'操作时间'">
          {{ detail.createTime }}
        </a-descriptions-item>
        <a-descriptions-item :label="'返回参数'" :span="2">
          <div v-if="detail.responseBody" class="max-h-200px overflow-auto">
            <pre class="m-0 text-12px whitespace-pre-wrap break-all">{{ JSON.stringify(detail.responseBody, null, 2) }}</pre>
          </div>
          <span v-else class="text-gray-400">无</span>
        </a-descriptions-item>
        <a-descriptions-item :label="'请求参数'" :span="2">
          <div v-if="detail.requestParams" class="max-h-200px overflow-auto">
            <pre class="m-0 text-12px whitespace-pre-wrap break-all">{{ JSON.stringify(detail.requestParams, null, 2) }}</pre>
          </div>
          <span v-else class="text-gray-400">无</span>
        </a-descriptions-item>
        <a-descriptions-item :label="'User Agent'" :span="2">
          <div class="break-all text-12px">{{ detail.userAgent }}</div>
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
  </a-modal>
</template>
