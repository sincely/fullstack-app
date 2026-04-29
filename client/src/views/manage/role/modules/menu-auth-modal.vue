<script setup>
import { computed, shallowRef, watch } from 'vue'

import { fetchGetAllPages, fetchGetMenuTree } from '@/service/api'

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
    tree.value = recursiveTransform(data)
  }
}

function recursiveTransform(data) {
  return data.map((item) => {
    const { id: key, label } = item

    if (item.children) {
      return {
        key,
        title: label,
        children: recursiveTransform(item.children)
      }
    }

    return {
      key,
      title: label
    }
  })
}

const checks = shallowRef([])

async function getChecks() {
  console.log(props.roleId)
  // 请求
  checks.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21]
}

function handleSubmit() {
  console.log(checks.value, props.roleId)
  // 请求

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
