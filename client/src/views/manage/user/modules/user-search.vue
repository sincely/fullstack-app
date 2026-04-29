<script setup>
import { computed } from 'vue'

import { useAntdForm, useFormRules } from '@/hooks/common/form'

defineOptions({
  name: 'UserSearch'
})

const emit = defineEmits(['reset', 'search'])

const { formRef, validate, resetFields } = useAntdForm()

const model = defineModel('model', { required: true })

const userGenderOptions = [
  { label: '男', value: '1' },
  { label: '女', value: '2' }
]

const enableStatusOptions = [
  { label: '启用', value: '1' },
  { label: '禁用', value: '2' }
]

const rules = computed(() => {
  const { patternRules } = useFormRules()

  return {
    userEmail: patternRules.email,
    userPhone: patternRules.phone
  }
})

async function reset() {
  await resetFields()
  emit('reset')
}

async function search() {
  await validate()
  emit('search')
}
</script>

<template>
  <ACard title="搜索" :bordered="false" class="card-wrapper">
    <AForm
      ref="formRef"
      :model="model"
      :rules="rules"
      :label-col="{
        span: 5,
        md: 7
      }"
    >
      <ARow :gutter="[16, 16]" wrap>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem label="用户名" name="userName" class="m-0">
            <AInput v-model:value="model.userName" placeholder="请输入用户名" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem label="性别" name="userGender" class="m-0">
            <ASelect v-model:value="model.userGender" placeholder="请选择性别" :options="userGenderOptions" clearable />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem label="昵称" name="nickName" class="m-0">
            <AInput v-model:value="model.nickName" placeholder="请输入昵称" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem label="手机号" name="userPhone" class="m-0">
            <AInput v-model:value="model.userPhone" placeholder="请输入手机号" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem label="邮箱" name="userEmail" class="m-0">
            <AInput v-model:value="model.userEmail" placeholder="请输入邮箱" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem label="用户状态" name="userStatus" class="m-0">
            <ASelect
              v-model:value="model.status"
              placeholder="请选择用户状态"
              :options="enableStatusOptions"
              clearable
            />
          </AFormItem>
        </ACol>
        <div class="flex-1">
          <AFormItem class="m-0">
            <div class="w-full flex-y-center justify-end gap-12px">
              <AButton @click="reset">
                <template #icon>
                  <icon-ic-round-refresh class="align-sub text-icon" />
                </template>
                <span class="ml-8px">重置</span>
              </AButton>
              <AButton type="primary" ghost @click="search">
                <template #icon>
                  <icon-ic-round-search class="align-sub text-icon" />
                </template>
                <span class="ml-8px">搜索</span>
              </AButton>
            </div>
          </AFormItem>
        </div>
      </ARow>
    </AForm>
  </ACard>
</template>

<style scoped></style>
