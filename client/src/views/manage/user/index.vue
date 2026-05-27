<script setup lang="jsx">
import { Button, Popconfirm, Switch, Tag, message } from 'ant-design-vue'

import { enableStatusRecord, userGenderRecord } from '@/constants/business'
import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table'
import {
  fetchBatchDeleteUser,
  fetchDeleteUser,
  fetchGetUserList,
  fetchResetUserPassword,
  fetchUpdateUserStatus
} from '@/service/api'

import UserOperateDrawer from './modules/user-operate-drawer.vue'
import UserSearch from './modules/user-search.vue'

const { tableWrapperRef, scrollConfig } = useTableScroll()

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
  apiFn: fetchGetUserList,
  apiParams: {
    current: 1,
    size: 10,
    // 如果要在表单中使用 searchParams，需要先定义对应字段
    // 不能省略字段，否则表单中的对应属性不会保持响应式
    status: undefined,
    userName: undefined,
    userGender: undefined,
    nickName: undefined,
    userPhone: undefined,
    userEmail: undefined
  },
  columns: () => [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 64
    },
    {
      key: 'userName',
      dataIndex: 'userName',
      title: '用户名',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'userGender',
      title: '性别',
      align: 'center',
      dataIndex: 'userGender',
      width: 100,
      customRender: ({ record }) => {
        if (record.userGender === null) {
          return null
        }

        const tagMap = {
          1: 'processing',
          2: 'error'
        }

        const label = userGenderRecord[record.userGender]

        return <Tag color={tagMap[record.userGender]}>{label}</Tag>
      }
    },
    {
      key: 'nickName',
      dataIndex: 'nickName',
      title: '昵称',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'userPhone',
      dataIndex: 'userPhone',
      title: '手机号',
      align: 'center',
      width: 120
    },
    {
      key: 'userEmail',
      dataIndex: 'userEmail',
      title: '邮箱',
      align: 'center',
      minWidth: 200
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '用户状态',
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        if (record.status === null) {
          return null
        }

        return (
          <Switch
            checked={record.status === '1'}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            onChange={(checked) => handleStatusChange(record, checked)}
          />
        )
      }
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 200,
      customRender: ({ record }) => (
        <div class="flex-center gap-8px">
          <Button type="primary" ghost size="small" onClick={() => edit(record.id)}>
            {'编辑'}
          </Button>
          <Button type="default" size="small" onClick={() => handleResetPassword(record)}>
            {'重置密码'}
          </Button>
          <Popconfirm title={'确认删除吗？'} onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small">
              {'删除'}
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]
})

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  rowSelection,
  onBatchDeleted,
  onDeleted
} = useTableOperate(data, getData)

async function handleBatchDelete() {
  const { error } = await fetchBatchDeleteUser({ ids: checkedRowKeys.value })
  if (!error) {
    onBatchDeleted()
  }
}

async function handleDelete(id) {
  const { error } = await fetchDeleteUser({ id })
  if (!error) {
    onDeleted()
  }
}

async function handleStatusChange(record, checked) {
  const newStatus = checked ? '1' : '2'
  const { error } = await fetchUpdateUserStatus({ id: record.id, status: newStatus })
  if (!error) {
    message.success('状态更新成功')
    getData()
  }
}

async function handleResetPassword(record) {
  const { error, data } = await fetchResetUserPassword({ id: record.id })
  if (!error) {
    message.success(data?.msg || '密码重置成功')
  }
}

function edit(id) {
  handleEdit(id)
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ACard
      :title="'用户列表'"
      :bordered="false"
      :body-style="{ flex: 1, overflow: 'hidden' }"
      class="flex-col-stretch sm:flex-1-hidden card-wrapper"
    >
      <template #extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
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

      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </ACard>
  </div>
</template>
