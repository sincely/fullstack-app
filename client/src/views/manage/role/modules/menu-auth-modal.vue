<script setup>
import { shallowRef, watch } from 'vue'

import { fetchGetMenuTree, fetchGetRoleRouteIds, fetchUpdateRoleRouteIds } from '@/service/api'

defineOptions({
  name: 'MenuAuthModal'
})

const props = defineProps({
  roleId: {
    type: Number,
    required: true
  }
})

const visible = defineModel('visible', {
  default: false
})

function closeModal() {
  visible.value = false
}

const title = '编辑菜单权限'

const tree = shallowRef([])

async function getTree() {
  const { error, data } = await fetchGetMenuTree()

  if (!error) {
    tree.value = transformMenuTree(data)
  }
}

function transformMenuTree(nodes = []) {
  return nodes.map((item) => ({
    key: String(item.id),
    title: item.meta?.title || item.name || item.path,
    children: item.children?.length ? transformMenuTree(item.children) : undefined
  }))
}

const checks = shallowRef([])

async function getChecks() {
  const { error, data } = await fetchGetRoleRouteIds({ roleId: props.roleId })

  if (!error) {
    checks.value = (data || []).map((item) => String(item))
  }
}

async function handleSubmit() {
  const routeIds = checks.value.map((item) => Number(item)).filter(Boolean)
  const { error } = await fetchUpdateRoleRouteIds({
    roleId: props.roleId,
    routeIds
  })

  if (error) {
    return
  }

  window.$message?.success?.('修改成功')

  closeModal()
}

async function init() {
  await getTree()
  await getChecks()
}

watch(visible, (val) => {
  if (val) {
    init()
  }
})
</script>

<template>
  <AModal v-model:open="visible" :title="title" class="w-480px">
    <div class="pb-12px text-14px text-secondary">{{ '勾选后保存该角色可访问的菜单' }}</div>
    <ATree v-model:checked-keys="checks" :tree-data="tree" checkable :height="280" class="h-280px" />
    <template #footer>
      <AButton size="small" class="mt-16px" @click="closeModal">
        {{ '取消' }}
      </AButton>
      <AButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
        {{ '确认' }}
      </AButton>
    </template>
  </AModal>
</template>
