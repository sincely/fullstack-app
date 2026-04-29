<script setup>
import { computed, shallowRef } from 'vue'

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

const title = computed(() => '编辑' + '按钮权限')

const tree = shallowRef([])

async function getAllButtons() {
  // 请求
  tree.value = [
    { key: 1, title: '按钮1', code: 'code1' },
    { key: 2, title: '按钮2', code: 'code2' },
    { key: 3, title: '按钮3', code: 'code3' },
    { key: 4, title: '按钮4', code: 'code4' },
    { key: 5, title: '按钮5', code: 'code5' },
    { key: 6, title: '按钮6', code: 'code6' },
    { key: 7, title: '按钮7', code: 'code7' },
    { key: 8, title: '按钮8', code: 'code8' },
    { key: 9, title: '按钮9', code: 'code9' },
    { key: 10, title: '按钮10', code: 'code10' }
  ]
}

const checks = shallowRef([])

async function getChecks() {
  console.log(props.roleId)
  // 请求
  checks.value = [1, 2, 3, 4, 5]
}

function handleSubmit() {
  console.log(checks.value, props.roleId)
  // 请求

  window.$message?.success?.('修改成功')

  closeModal()
}

function init() {
  getAllButtons()
  getChecks()
}

// 初始化
init()
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
