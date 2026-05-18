<script setup>
import { useBoolean } from '@sa/hooks'
import { computed, reactive, watch } from 'vue'

import { enableStatusOptions } from '@/constants/business'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { fetchCreateRole, fetchUpdateRole } from '@/service/api'

import ButtonAuthModal from './button-auth-modal.vue'
import MenuAuthModal from './menu-auth-modal.vue'

defineOptions({
  name: 'RoleOperateDrawer'
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
const { bool: menuAuthVisible, setTrue: openMenuAuthModal } = useBoolean()
const { bool: buttonAuthVisible, setTrue: openButtonAuthModal } = useBoolean()

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
    id: undefined,
    roleName: '',
    roleCode: '',
    roleDesc: '',
    status: '1',
    routeIds: []
  }
}

const rules = {
  roleName: defaultRequiredRule,
  roleCode: defaultRequiredRule,
  status: defaultRequiredRule
}

const roleId = computed(() => props.rowData?.id || -1)

const isEdit = computed(() => props.operateType === 'edit')

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel())
    return
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, createDefaultModel(), props.rowData)
  }
}

function closeDrawer() {
  visible.value = false
}

async function handleSubmit() {
  await validate()
  const submitApi = props.operateType === 'edit' ? fetchUpdateRole : fetchCreateRole
  const payload = {
    roleName: model.roleName,
    roleCode: model.roleCode,
    roleDesc: model.roleDesc,
    status: model.status,
    routeIds: props.operateType === 'edit' ? props.rowData?.routeIds || model.routeIds || [] : []
  }

  if (props.operateType === 'edit') {
    payload.roleId = props.rowData.id
  }

  const { error } = await submitApi(payload)

  if (error) {
    return
  }

  window.$message?.success(props.operateType === 'edit' ? '更新成功' : '创建成功')
  closeDrawer()
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
  <ADrawer v-model:open="visible" :title="title" :width="360">
    <AForm ref="formRef" :model="model" :rules="rules">
      <AFormItem :label="'角色名称'" name="roleName">
        <AInput v-model:value="model.roleName" :placeholder="'请输入角色名称'" />
      </AFormItem>
      <AFormItem :label="'角色编码'" name="roleCode">
        <AInput v-model:value="model.roleCode" :placeholder="'请输入角色编码'" />
      </AFormItem>
      <AFormItem :label="'角色状态'" name="status">
        <ARadioGroup v-model:value="model.status">
          <ARadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="item.label" />
        </ARadioGroup>
      </AFormItem>
      <AFormItem :label="'角色描述'" name="roleDesc">
        <AInput v-model:value="model.roleDesc" :placeholder="'请输入角色描述'" />
      </AFormItem>
    </AForm>
    <ASpace v-if="isEdit">
      <AButton @click="openMenuAuthModal">{{ '菜单权限' }}</AButton>
      <MenuAuthModal v-model:visible="menuAuthVisible" :role-id="roleId" />
      <AButton @click="openButtonAuthModal">{{ '按钮权限' }}</AButton>
      <ButtonAuthModal v-model:visible="buttonAuthVisible" :role-id="roleId" />
    </ASpace>
    <template #footer>
      <div class="flex-y-center justify-end gap-12px">
        <AButton @click="closeDrawer">{{ '取消' }}</AButton>
        <AButton type="primary" @click="handleSubmit">{{ '确认' }}</AButton>
      </div>
    </template>
  </ADrawer>
</template>
