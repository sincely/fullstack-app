<script setup>
import { computed, reactive, watch } from 'vue'

import { enableStatusOptions } from '@/constants/business'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { fetchCreateRole, fetchUpdateRole } from '@/service/api'

defineOptions({
  name: 'RoleOperateModal'
})

const props = defineProps({
  operateType: {
    type: String,
    required: true
  },
  rowData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submitted'])

const visible = defineModel('visible', {
  default: false
})

const { formRef, validate, resetFields } = useAntdForm()
const { defaultRequiredRule } = useFormRules()

const title = computed(() => {
  const titles = {
    add: '新增角色',
    edit: '编辑角色'
  }
  return titles[props.operateType]
})

const model = reactive(createDefaultModel())

function createDefaultModel() {
  return {
    roleName: '',
    roleCode: '',
    roleDesc: '',
    status: '1'
  }
}

const rules = {
  roleName: defaultRequiredRule,
  roleCode: defaultRequiredRule,
  status: defaultRequiredRule
}

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel())
    return
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, createDefaultModel(), props.rowData)
  }
}

function closeModal() {
  visible.value = false
}

async function handleSubmit() {
  await validate()

  const submitApi = props.operateType === 'edit' ? fetchUpdateRole : fetchCreateRole

  const payload = {
    roleName: model.roleName,
    roleCode: model.roleCode,
    roleDesc: model.roleDesc,
    status: model.status
  }

  if (props.operateType === 'edit') {
    payload.id = props.rowData.id
    payload.roleId = props.rowData.id
  }

  const { error } = await submitApi(payload)

  if (error) {
    return
  }

  window.$message?.success(props.operateType === 'edit' ? '更新成功' : '创建成功')
  closeModal()
  emit('submitted')
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit()
    resetFields()
  }
})
</script>

<template>
  <AModal v-model:open="visible" :title="title" width="500px">
    <AForm ref="formRef" :model="model" :rules="rules">
      <AFormItem :label="'角色名称'" name="roleName">
        <AInput v-model:value="model.roleName" :placeholder="'请输入角色名称'" />
      </AFormItem>
      <AFormItem :label="'角色编码'" name="roleCode">
        <AInput v-model:value="model.roleCode" :placeholder="'请输入角色编码'" />
      </AFormItem>
      <AFormItem :label="'角色状态'" name="status">
        <ARadioGroup v-model:value="model.status">
          <ARadio
            v-for="item in enableStatusOptions"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </ARadio>
        </ARadioGroup>
      </AFormItem>
      <AFormItem :label="'角色描述'" name="roleDesc">
        <ATextarea v-model:value="model.roleDesc" :placeholder="'请输入角色描述'" :rows="3" />
      </AFormItem>
    </AForm>
    <template #footer>
      <ASpace justify="end" :size="16">
        <AButton @click="closeModal">取消</AButton>
        <AButton type="primary" @click="handleSubmit">确认</AButton>
      </ASpace>
    </template>
  </AModal>
</template>
