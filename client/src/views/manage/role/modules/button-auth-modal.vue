<script setup>
import { shallowRef, watch } from 'vue'

import { fetchGetAllButtons, fetchGetRoleButtonIds, fetchUpdateRoleButtonIds } from '@/service/api'

defineOptions({
  name: 'ButtonAuthModal'
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

const title = '编辑按钮权限'

const tree = shallowRef([])

async function getAllButtons() {
  const { error, data } = await fetchGetAllButtons()

  if (!error) {
    tree.value = transformButtonTree(data || [])
  }
}

function transformButtonTree(buttons = []) {
  const routeMap = new Map()

  buttons.forEach((item) => {
    const routeKey = `route-${item.routeId}`
    if (!routeMap.has(routeKey)) {
      routeMap.set(routeKey, {
        key: routeKey,
        title: item.routeName,
        children: []
      })
    }

    routeMap.get(routeKey).children.push({
      key: String(item.buttonId),
      title: item.buttonLabel || item.buttonName
    })
  })

  return Array.from(routeMap.values())
}

const checks = shallowRef([])

async function getChecks() {
  const { error, data } = await fetchGetRoleButtonIds({ roleId: props.roleId })

  if (!error) {
    checks.value = (data || []).map((item) => String(item))
  }
}

async function handleSubmit() {
  const buttonIds = checks.value.map((item) => Number(item)).filter(Boolean)
  const { error } = await fetchUpdateRoleButtonIds({
    roleId: props.roleId,
    buttonIds
  })

  if (error) {
    return
  }

  window.$message?.success?.('修改成功')

  closeModal()
}

function init() {
  getAllButtons()
  getChecks()
}

watch(visible, () => {
  if (visible.value) {
    init()
  }
})
</script>

<template>
  <AModal v-model:open="visible" :title="title" class="w-480px">
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
