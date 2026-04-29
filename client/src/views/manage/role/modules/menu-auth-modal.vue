<script setup>
import { computed, shallowRef, watch } from 'vue'

import { fetchGetAllPages, fetchGetMenuTree, fetchGetRoleRouteIds, fetchUpdateRoleRouteIds } from '@/service/api'

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

const title = computed(() => '编辑' + '菜单权限')

const home = shallowRef('')

async function getHome() {
  console.log(props.roleId)

  home.value = 'home'
}

async function updateHome(val) {
  // 请求

  home.value = val
}

const pages = shallowRef([])

async function getPages() {
  const { error, data } = await fetchGetAllPages()

  if (!error) {
    pages.value = data
  }
}

const pageSelectOptions = computed(() => {
  const opts = pages.value.map((page) => ({
    label: page,
    value: page
  }))

  return opts
})

const tree = shallowRef([])

async function getTree() {
  const { error, data } = await fetchGetMenuTree()

  if (!error) {
    tree.value = transformFlatMenuTree(data)
  }
}

function transformFlatMenuTree(data) {
  const nodeMap = new Map(
    data.map((item) => [
      String(item.id),
      {
        key: String(item.id),
        title: item.label,
        children: []
      }
    ])
  )

  const roots = []

  data.forEach((item) => {
    const currentNode = nodeMap.get(String(item.id))
    const parentId = String(item.pId)

    if (parentId !== '0' && nodeMap.has(parentId)) {
      nodeMap.get(parentId).children.push(currentNode)
      return
    }

    roots.push(currentNode)
  })

  return roots
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
  getHome()
  getPages()
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
    <div class="flex-y-center gap-16px pb-12px">
      <div>{{ '首页' }}</div>
      <ASelect :value="home" :options="pageSelectOptions" class="w-240px" @update:value="updateHome" />
    </div>
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
