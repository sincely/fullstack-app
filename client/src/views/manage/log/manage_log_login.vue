<script setup lang="jsx">
import { Button, Popconfirm, Tag, message } from 'ant-design-vue'
import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table'
import { fetchBatchDeleteLoginLog, fetchClearLoginLogs, fetchGetLoginLogList } from '@/service/api'

import LoginLogSearch from './modules/login-log-search.vue'

const { tableWrapperRef, scrollConfig } = useTableScroll()

const statusRecord = {
  1: { text: '成功', color: 'success' },
  0: { text: '失败', color: 'error' }
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
  apiFn: fetchGetLoginLogList,
  apiParams: {
    current: 1,
    size: 10,
    username: undefined,
    ipAddress: undefined,
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
      title: '用户名',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'loginType',
      dataIndex: 'loginType',
      title: '登录方式',
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        const typeMap = {
          password: '密码登录',
          code: '验证码登录',
          sms: '短信登录'
        }
        return typeMap[record.loginType] || record.loginType
      }
    },
    {
      key: 'ipAddress',
      dataIndex: 'ipAddress',
      title: 'IP地址',
      align: 'center',
      width: 140
    },
    {
      key: 'location',
      dataIndex: 'location',
      title: '登录地点',
      align: 'center',
      minWidth: 150
    },
    {
      key: 'browser',
      dataIndex: 'browser',
      title: '浏览器',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'os',
      dataIndex: 'os',
      title: '操作系统',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '登录状态',
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        const status = statusRecord[record.status]
        return status ? <Tag color={status.color}>{status.text}</Tag> : null
      }
    },
    {
      key: 'message',
      dataIndex: 'message',
      title: '提示信息',
      align: 'center',
      minWidth: 150,
      ellipsis: true
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '登录时间',
      align: 'center',
      width: 180
    }
  ]
})

const { checkedRowKeys, rowSelection, onBatchDeleted } = useTableOperate(data, getData)

async function handleBatchDelete() {
  const { error } = await fetchBatchDeleteLoginLog({ ids: checkedRowKeys.value })
  if (!error) {
    onBatchDeleted()
  }
}

async function handleClearAll() {
  const { error } = await fetchClearLoginLogs()
  if (!error) {
    message.success('登录日志已清空')
    getData()
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <LoginLogSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ACard
      title="登录日志"
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
          <APopconfirm title="确认清空所有登录日志吗？此操作不可恢复！" @confirm="handleClearAll">
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
