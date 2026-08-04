<script setup>
import { computed, reactive, ref, watch } from 'vue'

import { enableStatusOptions, userGenderOptions } from '@/constants/business'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { fetchCreateUser, fetchGetAllRoles, fetchUpdateUser } from '@/service/api'
defineOptions({
  name: 'UserOperateModal'
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
    password: '',
    userGender: '1',
    nickName: '',
    userPhone: '',
    userEmail: '',
    roleIds: [],
    status: '1',
    avatar: ''
  }
}

const rules = computed(() => {
  const requiredRule = createRequiredRule('不能为空')

  return {
    userName: requiredRule,
    ...(props.operateType === 'add' ? { password: requiredRule } : {}),
    userEmail: [requiredRule, patternRules.email],
    roleIds: requiredRule,
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
      value: item.roleId,
      roleCode: item.roleCode
    }))

    roleOptions.value = [...options]
  }
}

async function handleInitModel() {
  Object.assign(model, createDefaultModel())

  if (props.operateType === 'edit' && props.rowData) {
    const roleIds = Array.isArray(props.rowData.roleIds) ? props.rowData.roleIds.map(Number).filter(Boolean) : []

    Object.assign(model, {
      id: props.rowData.id,
      userName: props.rowData.userName ?? '',
      password: '',
      userGender: props.rowData.userGender ?? '1',
      nickName: props.rowData.nickName ?? '',
      userPhone: props.rowData.userPhone ?? '',
      userEmail: props.rowData.userEmail ?? '',
      status: props.rowData.status ?? '1',
      roleIds
    })
  }
}

function closeModal() {
  visible.value = false
}

async function handleSubmit() {
  await validate()
  if (props.operateType === 'add') {
    const payload = {
      username: model.userName,
      password: model.password,
      gender: model.userGender,
      email: model.userEmail,

      status: model.status,
      roleIds: model.roleIds,
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
      password: model.password || undefined,
      gender: model.userGender,
      email: model.userEmail || undefined,
      status: model.status,
      roleIds: model.roleIds,
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

  closeModal()
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
  <AModal v-model:open="visible" :title="title" width="800px">
    <AForm
      ref="formRef"
      :model="model"
      :rules="rules"
      :label-col="{ lg: 8, xs: 4 }"
      label-wrap
      class="pr-20px"
    >
      <ARow>
        <ACol :lg="12" :xs="24">
          <AFormItem :label="'用户名'" name="userName">
            <AInput v-model:value="model.userName" :placeholder="'请输入用户名'" :disabled="props.operateType === 'edit'" />
          </AFormItem>
        </ACol>
        <ACol :lg="12" :xs="24">
          <AFormItem :label="props.operateType === 'add' ? '密码' : '新密码'" name="password">
            <AInputPassword
              v-model:value="model.password"
              :placeholder="props.operateType === 'add' ? '请输入密码' : '不修改可留空'"
            />
          </AFormItem>
        </ACol>
        <ACol :lg="12" :xs="24">
          <AFormItem :label="'性别'" name="userGender">
            <ARadioGroup v-model:value="model.userGender">
              <ARadio v-for="item in userGenderOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </ARadio>
            </ARadioGroup>
          </AFormItem>
        </ACol>
        <ACol :lg="12" :xs="24">
          <AFormItem :label="'昵称'" name="nickName">
            <AInput v-model:value="model.nickName" :placeholder="'请输入昵称'" />
          </AFormItem>
        </ACol>
        <ACol :lg="12" :xs="24">
          <AFormItem :label="'手机号'" name="userPhone">
            <AInput v-model:value="model.userPhone" :placeholder="'请输入手机号'" />
          </AFormItem>
        </ACol>
        <ACol :lg="12" :xs="24">
          <AFormItem :label="'邮箱'" name="userEmail">
            <AInput v-model:value="model.userEmail" :placeholder="'请输入邮箱'" />
          </AFormItem>
        </ACol>
        <ACol :lg="12" :xs="24">
          <AFormItem :label="'用户状态'" name="status">
            <ARadioGroup v-model:value="model.status">
              <ARadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </ARadio>
            </ARadioGroup>
          </AFormItem>
        </ACol>
        <ACol :lg="12" :xs="24">
          <AFormItem :label="'用户角色'" name="roleIds">
            <ASelect
              v-model:value="model.roleIds"
              :options="roleOptions"
              :placeholder="'请选择用户角色'"
              mode="multiple"
              :max-tag-count="3"
            />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
    <template #footer>
      <ASpace :size="16">
        <AButton @click="closeModal">{{ '取消' }}</AButton>
        <AButton type="primary" @click="handleSubmit">{{ '确认' }}</AButton>
      </ASpace>
    </template>
  </AModal>
</template>

<style scoped></style>
