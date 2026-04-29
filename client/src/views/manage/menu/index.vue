<script setup lang="jsx">
import { useBoolean } from '@sa/hooks'
import { Button, Popconfirm, Tag } from 'ant-design-vue'
import { ref } from 'vue'

import SvgIcon from '@/components/custom/svg-icon.vue'
import { enableStatusRecord, menuTypeRecord } from '@/constants/business'
import { yesOrNoRecord } from '@/constants/common'
import { useTable, useTableOperate, useTableScroll } from '@/hooks/common/table'
import { fetchDeleteMenu, fetchGetAllPages, fetchGetMenuList } from '@/service/api'

import MenuOperateModal from './modules/menu-operate-modal.vue'

const { bool: visible, setTrue: openModal } = useBoolean()
const { tableWrapperRef, scrollConfig } = useTableScroll()

const { columns, columnChecks, data, loading, pagination, getData, getDataByPage } = useTable({
  apiFn: fetchGetMenuList,
  columns: () => [
    {
      key: 'id',
      title: 'ID',
      align: 'center',
      dataIndex: 'id'
    },
    {
      key: 'menuType',
      title: '菜单类型',
      align: 'center',
      width: 80,
      customRender: ({ record }) => {
        const tagMap = {
          1: 'default',
          2: 'processing'
        }

        const label = menuTypeRecord[record.menuType]

        return <Tag color={tagMap[record.menuType]}>{label}</Tag>
      }
    },
    {
      key: 'menuName',
      title: '菜单名称',
      align: 'center',
      minWidth: 120,
      customRender: ({ record }) => {
        return <span>{record.menuName}</span>
      }
    },
    {
      key: 'icon',
      title: '图标',
      align: 'center',
      width: 60,
      customRender: ({ record }) => {
        const icon = record.iconType === '1' ? record.icon : undefined

        const localIcon = record.iconType === '2' ? record.icon : undefined

        return (
          <div class="flex-center">
            <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
          </div>
        )
      }
    },
    {
      key: 'routeName',
      title: '路由名称',
      align: 'center',
      dataIndex: 'routeName',
      minWidth: 120
    },
    {
      key: 'routePath',
      title: '路由路径',
      align: 'center',
      dataIndex: 'routePath',
      minWidth: 120
    },
    {
      key: 'status',
      title: '菜单状态',
      align: 'center',
      width: 80,
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
      key: 'hideInMenu',
      title: '隐藏菜单',
      dataIndex: 'hideInMenu',
      align: 'center',
      width: 80,
      customRender: ({ record }) => {
        const hide = record.hideInMenu ? 'Y' : 'N'

        const tagMap = {
          Y: 'error',
          N: 'default'
        }

        const label = yesOrNoRecord[hide]

        return <Tag color={tagMap[hide]}>{label}</Tag>
      }
    },
    {
      key: 'parentId',
      dataIndex: 'parentId',
      title: '父级菜单ID',
      width: 90,
      align: 'center'
    },
    {
      key: 'order',
      dataIndex: 'order',
      title: '排序',
      align: 'center',
      width: 60
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      width: 230,
      customRender: ({ record }) => (
        <div class="flex-center justify-end gap-8px">
          {record.menuType === '1' && (
            <Button type="primary" ghost size="small" onClick={() => handleAddChildMenu(record)}>
              {'新增子菜单'}
            </Button>
          )}
          <Button type="primary" ghost size="small" onClick={() => handleEdit(record)}>
            {'编辑'}
          </Button>
          <Popconfirm title={'确认删除吗？'} onConfirm={() => handleDelete(record.id)}>
            <Button danger ghost size="small">
              {'删除'}
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]
})

const { checkedRowKeys, rowSelection, onBatchDeleted, onDeleted } = useTableOperate(data, getData)

const operateType = ref('add')

function handleAdd() {
  operateType.value = 'add'
  openModal()
}

async function handleBatchDelete() {
  const { error } = await fetchDeleteMenu({ ids: checkedRowKeys.value })

  if (!error) {
    onBatchDeleted()
  }
}

async function handleDelete(id) {
  const { error } = await fetchDeleteMenu({ id })

  if (!error) {
    onDeleted()
  }
}
/** 编辑菜单数据或新增子菜单时的父菜单数据 */
const editingData = ref(null)

function handleEdit(item) {
  operateType.value = 'edit'
  editingData.value = { ...item }

  openModal()
}

function handleAddChildMenu(item) {
  operateType.value = 'addChild'

  editingData.value = { ...item }

  openModal()
}

const allPages = ref([])

async function getAllPages() {
  const { data: pages } = await fetchGetAllPages()
  allPages.value = pages || []
}

function init() {
  getAllPages()
}

// 初始化
init()
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <ACard
      :title="'菜单列表'"
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
        :row-selection="rowSelection"
        size="small"
        :loading="loading"
        row-key="id"
        :scroll="scrollConfig"
        :pagination="pagination"
        class="h-full"
      />
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getDataByPage"
      />
    </ACard>
  </div>
</template>
