<script setup>
import { shallowRef, watch } from 'vue'

import { fetchGetMenuTree, fetchGetRoleRouteIds, fetchUpdateRoleRouteIds } from '@/service/api'

defineOptions({
  name: 'RolePermissionModal'
})

const props = defineProps({
  rowData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submitted'])

const visible = defineModel('visible', {
  default: false
})

// ==================== 权限树（目录→菜单→按钮 三级） ====================
const authTree = shallowRef([])
const authChecks = shallowRef([])
const buttonNodeIds = shallowRef(new Set())
const loading = shallowRef(false)

async function getAuthTree() {
  const { error, data } = await fetchGetMenuTree()
  if (!error) {
    const btnIds = new Set()
    authTree.value = transformAuthTree(data, btnIds)
    buttonNodeIds.value = btnIds
  }
}

function transformAuthTree(nodes = [], btnIdSet) {
  return nodes.map((item) => {
    const isButton = item.meta?.isButton === true
    if (isButton) {
      btnIdSet.add(String(item.id))
    }

    const node = {
      key: String(item.id),
      title: item.meta?.title || item.name || item.path
    }

    if (item.children?.length) {
      node.children = transformAuthTree(item.children, btnIdSet)
    }

    return node
  })
}

async function getAuthChecks() {
  if (!props.rowData?.id) return
  const { error, data } = await fetchGetRoleRouteIds({ roleId: props.rowData.id })
  if (!error) {
    authChecks.value = (data || []).map((item) => String(item))
  }
}

// ==================== 提交 ====================
async function handleSubmit() {
  loading.value = true
  try {
    const allRouteIds = authChecks.value.map((item) => Number(item)).filter(Boolean)

    const { error } = await fetchUpdateRoleRouteIds({
      roleId: props.rowData.id,
      routeIds: allRouteIds
    })

    if (error) {
      return
    }

    window.$message?.success('权限分配成功')
    visible.value = false
    emit('submitted')
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  visible.value = false
}

watch(visible, () => {
  if (visible.value) {
    authChecks.value = []
    Promise.all([getAuthTree(), getAuthChecks()])
  }
})
</script>

<template>
  <a-modal v-model:open="visible" :title="`分配权限 - ${rowData?.roleName || ''}`" width="700px">
    <a-alert
      message="勾选目录/菜单/按钮节点，保存后该角色将拥有相应的访问和操作权限"
      type="info"
      show-icon
      class="mb-12px"
    />
    <a-tree
      v-model:checked-keys="authChecks"
      :tree-data="authTree"
      checkable
      :height="380"
      class="h-380px"
      :default-expand-all="true"
    />
    <template #footer>
      <a-space justify="end" :size="16">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit">确认</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
