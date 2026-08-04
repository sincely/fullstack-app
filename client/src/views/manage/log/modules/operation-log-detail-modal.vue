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
  <AModal v-model:open="visible" title="操作日志详情" width="700px" :footer="null">
    <ASpin :spinning="loading">
      <ADescriptions :column="2" bordered size="small">
        <ADescriptionsItem :label="'日志ID'">
          {{ detail.id }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'操作用户'">
          {{ detail.username }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'操作类型'">
          {{ detail.action }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'系统模块'">
          {{ detail.module }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'请求方法'">
          {{ detail.method }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'请求URL'">
          {{ detail.requestUrl }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'IP地址'">
          {{ detail.ipAddress }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'执行时间'">
          <template v-if="detail.executeTime !== null">
            {{ detail.executeTime }}ms
          </template>
        </ADescriptionsItem>
        <ADescriptionsItem :label="'状态'">
          <template v-if="detail.status !== null">
            <ATag :color="statusRecord[detail.status]?.color">
              {{ statusRecord[detail.status]?.text }}
            </ATag>
          </template>
        </ADescriptionsItem>
        <ADescriptionsItem :label="'操作时间'">
          {{ detail.createTime }}
        </ADescriptionsItem>
        <ADescriptionsItem :label="'返回参数'" :span="2">
          <div v-if="detail.responseBody" class="max-h-200px overflow-auto">
            <pre class="m-0 text-12px whitespace-pre-wrap break-all">{{ JSON.stringify(detail.responseBody, null, 2) }}</pre>
          </div>
          <span v-else class="text-gray-400">无</span>
        </ADescriptionsItem>
        <ADescriptionsItem :label="'请求参数'" :span="2">
          <div v-if="detail.requestParams" class="max-h-200px overflow-auto">
            <pre class="m-0 text-12px whitespace-pre-wrap break-all">{{ JSON.stringify(detail.requestParams, null, 2) }}</pre>
          </div>
          <span v-else class="text-gray-400">无</span>
        </ADescriptionsItem>
        <ADescriptionsItem :label="'User Agent'" :span="2">
          <div class="break-all text-12px">{{ detail.userAgent }}</div>
        </ADescriptionsItem>
      </ADescriptions>
    </ASpin>
  </AModal>
</template>
