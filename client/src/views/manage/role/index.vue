<script setup lang="jsx">
import { useElementSize } from '@vueuse/core'
import { Button, Popconfirm, Tag } from 'ant-design-vue'
import { computed, shallowRef } from 'vue'

import { enableStatusRecord } from '@/constants/business'
import { useTable, useTableOperate } from '@/hooks/common/table'
import { fetchDeleteRole, fetchGetRoleList } from '@/service/api'

import RoleOperateDrawer from './modules/role-operate-drawer.vue'
import RoleSearch from './modules/role-search.vue'

const wrapperEl = shallowRef(null)
const { height: wrapperElHeight } = useElementSize(wrapperEl)

const scrollConfig = computed(() => {
  return {
    y: wrapperElHeight.value - 72,
    x: 702
  }
})

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination, searchParams, resetSearchParams } =
  useTable({
  apiFn: fetchGetRoleList,
  apiParams: {
    current: 1,
    size: 10,
    status: undefined,
    roleName: undefined,
    roleCode: undefined
  },
  columns: () => [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      width: 64,
      align: 'center'
    },
    {
      key: 'roleName',
      dataIndex: 'roleName',
      title: '角色名称',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleCode',
      dataIndex: 'roleCode',
      title: '角色编码',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleDesc',
      dataIndex: 'roleDesc',
      title: '角色描述',
      minWidth: 120
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '角色状态',
      align: 'center',
      width: 100,
      customRender: ({ record }) => {
        if (record.status === null) {
          return null
        }

        const tagMap = {
          1: 'success',
          2: 'warning'
        }

        const label = enableStatusRecord[record.status]

        return <Tag color={tagMap[record.status]}>{label}</Tag>
      }
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 130,
      customRender: ({ record }) => (
        <div class="flex-center gap-8px">
          <Button type="primary" ghost size="small" onClick={() => edit(record.id)}>
            {'编辑'}
          </Button>
          <Popconfirm onConfirm={() => handleDelete(record.id)} content={'确认删除吗？'}>
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
  const deleteTasks = checkedRowKeys.value.map((id) => fetchDeleteRole({ id }))
  const results = await Promise.all(deleteTasks)

  if (results.every((item) => !item.error)) {
    onBatchDeleted()
  }
}

async function handleDelete(id) {
  const { error } = await fetchDeleteRole({ id })

  if (!error) {
    onDeleted()
  }
}

function edit(id) {
  handleEdit(id)
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <ACard
      :title="'角色列表'"
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
        ref="wrapperEl"
        :columns="columns"
        :data-source="data"
        :loading="loading"
        :row-selection="rowSelection"
        row-key="id"
        size="small"
        :pagination="mobilePagination"
        :scroll="scrollConfig"
        class="h-full"
      />
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
          @submitted="getData"
      />
    </ACard>
  </div>
</template>
