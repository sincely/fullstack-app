<script setup lang="jsx">
import { Button, Popconfirm, Tag, message } from 'ant-design-vue'
import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table'
import { fetchBatchDeleteOperationLog, fetchClearOperationLogs, fetchGetOperationLogList } from '@/service/api'

import OperationLogSearch from './modules/operation-log-search.vue'

const { tableWrapperRef, scrollConfig } = useTableScroll()

const statusRecord = {
  1: { text: '成功', color: 'success' },
  0: { text: '失败', color: 'error' }
}

const methodColorMap = {
  GET: 'blue',
  POST: 'green',
  PUT: 'orange',
  DELETE: 'red',
  PATCH: 'purple'
}

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetOperationLogList,
  apiParams: {
    current: 1,
    size: 10,
    username: undefined,
    module: undefined,
    action: undefined,
    status: undefined,
    startTime: undefined,
    endTime: undefined
  },
  columns: () => [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      align: 'center',
      width: 60
    },
    {
      key: 'username',
      dataIndex: 'username',
      title: '操作用户',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: '操作类型',
      align: 'center',
      width: 100
    },
    {
      key: 'method',
      dataIndex: 'method',
      title: '请求方法',
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        return <Tag color={methodColorMap[record.method] || 'default'}>{record.method}</Tag>
      }
    },
    {
      key: 'requestUrl',
      dataIndex: 'requestUrl',
      title: '请求URL',
      align: 'center',
      minWidth: 200,
      ellipsis: true
    },
    {
      key: 'ipAddress',
      dataIndex: 'ipAddress',
      title: 'IP地址',
      align: 'center',
      width: 140
    },
    {
      key: 'executeTime',
      dataIndex: 'executeTime',
      title: '执行时间',
      align: 'center',
      width: 100,
      customRender: ({ record }) => `${record.executeTime}ms`
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      align: 'center',
      width: 80,
      customRender: ({ record }) => {
        const status = statusRecord[record.status]
        return status ? <Tag color={status.color}>{status.text}</Tag> : null
      }
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '操作时间',
      align: 'center',
      width: 180
    }
  ]
})

const { checkedRowKeys, rowSelection, onBatchDeleted } = useTableOperate(data, getData)

async function handleBatchDelete() {
  const { error } = await fetchBatchDeleteOperationLog({ ids: checkedRowKeys.value })
  if (!error) {
    onBatchDeleted()
  }
}

async function handleClearAll() {
  const { error } = await fetchClearOperationLogs()
  if (!error) {
    message.success('操作日志已清空')
    getData()
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OperationLogSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ACard
      title="操作日志"
      :bordered="false"
      :body-style="{ flex: 1, overflow: 'hidden' }"
      class="flex-col-stretch sm:flex-1-hidden card-wrapper"
    >
      <template #extra>
        <div class="flex gap-8px">
          <APopconfirm title="确认批量删除选中的日志吗？" @confirm="handleBatchDelete">
            <AButton :disabled="checkedRowKeys.length === 0" danger size="small">
              批量删除
            </AButton>
          </APopconfirm>
          <APopconfirm title="确认清空所有操作日志吗？此操作不可恢复！" @confirm="handleClearAll">
            <AButton danger size="small"> 清空日志 </AButton>
          </APopconfirm>
          <AButton size="small" @click="getData">刷新</AButton>
        </div>
      </template>

      <ATable
        ref="tableWrapperRef"
        :columns="columns"
        :data-source="data"
        size="small"
        :row-selection="rowSelection"
        :scroll="scrollConfig"
        :loading="loading"
        row-key="id"
        :pagination="mobilePagination"
        class="h-full"
      />
    </ACard>
  </div>
</template>
