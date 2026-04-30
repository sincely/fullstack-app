<script setup>
import { computed, reactive, ref, watch } from 'vue'

import { enableStatusOptions, userGenderOptions } from '@/constants/business'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { fetchCreateUser, fetchGetAllRoles, fetchUpdateUser } from '@/service/api'
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
const { createRequiredRule, patternRules } = useFormRules()

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
    id: undefined,
    userName: '',
    userGender: '1',
    nickName: '',
    userPhone: '',
    userEmail: '',
    roleId: undefined,
    status: '1',
    avatar: ''
  }
}

const rules = computed(() => {
  const requiredRule = createRequiredRule('不能为空')

  return {
    userName: requiredRule,
    userEmail: [requiredRule, patternRules.email],
    roleId: requiredRule,
    status: requiredRule
  }
})

/** 可用角色选项 */
const roleOptions = ref([])

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRoles()

  if (!error) {
    const options = data.map((item) => ({
      label: item.roleName,
      value: item.id,
      roleCode: item.roleCode
    }))

    // mock 数据中缺少 roleCode，这里补齐当前用户已有角色
    // 接入真实接口后可移除下面这段兜底逻辑
    // const userRoleOptions = model.userRoles.map((item) => ({
    //   label: item,
    //   value: item
    // }))
    // 兜底逻辑结束

    roleOptions.value = [...options]
  }
}

async function handleInitModel() {
  Object.assign(model, createDefaultModel())

  if (props.operateType === 'edit' && props.rowData) {
    const currentRoleCode = props.rowData.userRoles?.[0]
    const matchedRole = roleOptions.value.find((item) => item.roleCode === currentRoleCode)

    Object.assign(model, {
      id: props.rowData.id,
      userName: props.rowData.userName ?? '',
      userGender: props.rowData.userGender ?? '1',
      nickName: props.rowData.nickName ?? '',
      userPhone: props.rowData.userPhone ?? '',
      userEmail: props.rowData.userEmail ?? '',
      status: props.rowData.status ?? '1',
      roleId: props.rowData.roleId ?? matchedRole?.value
    })
  }
}

function closeDrawer() {
  visible.value = false
}

async function handleSubmit() {
  await validate()
  if (props.operateType === 'add') {
    const payload = {
      username: model.userName,
      gender: model.userGender,
      email: model.userEmail,

      status: model.status,
      roleId: model.roleId,
      phone: model.userPhone || undefined,
      nickName: model.nickName || undefined,
      avatar: model.avatar || undefined
    }
    const { error } = await fetchCreateUser(payload)
    if (error) {
      return
    }
    window.$message?.success('创建成功')
  } else {
    const payload = {
      id: model.id,
      gender: model.userGender,
      email: model.userEmail || undefined,
      status: model.status,
      roleId: model.roleId,
      phone: model.userPhone || undefined,
      nickName: model.nickName || undefined,
      avatar: model.avatar || undefined
    }

    const { error } = await fetchUpdateUser(payload)
    if (error) {
      return
    }
    window.$message?.success('更新成功')
  }

  closeDrawer()
  emit('submitted')
}

watch(visible, () => {
  if (visible.value) {
    getRoleOptions().then(() => {
      resetFields()
      handleInitModel()
    })
  }
})
</script>

<template>
  <ADrawer v-model:open="visible" :title="title" :width="360">
    <AForm ref="formRef" layout="vertical" :model="model" :rules="rules">
      <AFormItem :label="'用户名'" name="userName">
        <AInput v-model:value="model.userName" :placeholder="'请输入用户名'" :disabled="props.operateType === 'edit'" />
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
      <AFormItem :label="'邮箱'" name="userEmail">
        <AInput v-model:value="model.userEmail" :placeholder="'请输入邮箱'" />
      </AFormItem>
      <AFormItem :label="'用户状态'" name="status">
        <ARadioGroup v-model:value="model.status">
          <ARadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </ARadio>
        </ARadioGroup>
      </AFormItem>
      <AFormItem :label="'用户角色'" name="roleId">
        <ASelect v-model:value="model.roleId" :options="roleOptions" :placeholder="'请选择用户角色'" />
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
