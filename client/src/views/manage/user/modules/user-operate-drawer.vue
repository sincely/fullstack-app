<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'

import { enableStatusOptions, userGenderOptions } from '@/constants/business'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { fetchGetAllRoles } from '@/service/api'
defineOptions({
  name: 'UserOperateDrawer'
})

const props = defineProps({
  operateType: {
    type: String,
    required: true
  },
  rowData: {
    type: Object,
    default: null
  },
  allPages: {
    type: Array,
    default: () => []
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
    add: '新增用户',
    edit: '编辑用户'
  }
  return titles[props.operateType]
})

const model = reactive(createDefaultModel())

function createDefaultModel() {
  return {
    userName: '',
    userGender: '1',
    nickName: '',
    userPhone: '',
    userEmail: '',
    userRoles: [],
    status: '1'
  }
}

const rules = {
  userName: defaultRequiredRule,
  status: defaultRequiredRule
}

/** 可用角色选项 */
const roleOptions = ref([])

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles()

  if (!error) {
    const options = data.map((item) => ({
      label: item.roleName,
      value: item.roleCode
    }))

    // mock 数据中缺少 roleCode，这里补齐当前用户已有角色
    // 接入真实接口后可移除下面这段兜底逻辑
    const userRoleOptions = model.userRoles.map((item) => ({
      label: item,
      value: item
    }))
    // 兜底逻辑结束

    roleOptions.value = [...userRoleOptions, ...options]
  }
}

async function handleInitModel() {
  Object.assign(model, createDefaultModel())

  if (props.operateType === 'edit' && props.rowData) {
    await nextTick()
    Object.assign(model, props.rowData)
  }
}

function closeDrawer() {
  visible.value = false
}

async function handleSubmit() {
  await validate()
  // 请求
  window.$message?.success('更新成功')
  closeDrawer()
  emit('submitted')
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel()
    resetFields()
    getRoleOptions()
  }
})
</script>

<template>
  <ADrawer v-model:open="visible" :title="title" :width="360">
    <AForm ref="formRef" layout="vertical" :model="model" :rules="rules">
      <AFormItem :label="'用户名'" name="userName">
        <AInput v-model:value="model.userName" :placeholder="'请输入用户名'" />
      </AFormItem>
      <AFormItem :label="'性别'" name="userGender">
        <ARadioGroup v-model:value="model.userGender">
          <ARadio v-for="item in userGenderOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </ARadio>
        </ARadioGroup>
      </AFormItem>
      <AFormItem :label="'昵称'" name="nickName">
        <AInput v-model:value="model.nickName" :placeholder="'请输入昵称'" />
      </AFormItem>
      <AFormItem :label="'手机号'" name="userPhone">
        <AInput v-model:value="model.userPhone" :placeholder="'请输入手机号'" />
      </AFormItem>
      <AFormItem :label="'邮箱'" name="email">
        <AInput v-model:value="model.userEmail" :placeholder="'请输入邮箱'" />
      </AFormItem>
      <AFormItem :label="'用户状态'" name="status">
        <ARadioGroup v-model:value="model.status">
          <ARadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </ARadio>
        </ARadioGroup>
      </AFormItem>
      <AFormItem :label="'用户角色'" name="roles">
        <ASelect v-model:value="model.userRoles" multiple :options="roleOptions" :placeholder="'请选择用户角色'" />
      </AFormItem>
    </AForm>
    <template #footer>
      <ASpace :size="16">
        <AButton @click="closeDrawer">{{ '取消' }}</AButton>
        <AButton type="primary" @click="handleSubmit">{{ '确认' }}</AButton>
      </ASpace>
    </template>
  </ADrawer>
</template>

<style scoped></style>
