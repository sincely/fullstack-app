<script setup>
import { computed, reactive, watch } from 'vue'

import { enableStatusOptions } from '@/constants/business'
import { useAntdForm, useFormRules } from '@/hooks/common/form'
import { fetchCreateDict, fetchUpdateDict } from '@/service/api'

defineOptions({
  name: 'DictOperateModal'
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
    add: '新增字典',
    edit: '编辑字典'
  }
  return titles[props.operateType]
})

const model = reactive(createDefaultModel())

function createDefaultModel() {
  return {
    dictName: '',
    dictCode: '',
    status: '1',
    remark: ''
  }
}

const rules = {
  dictName: defaultRequiredRule,
  dictCode: defaultRequiredRule,
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

  const submitApi = props.operateType === 'edit' ? fetchUpdateDict : fetchCreateDict

  const payload = {
    dictName: model.dictName,
    dictCode: model.dictCode,
    status: model.status,
    remark: model.remark
  }

  if (props.operateType === 'edit') {
    payload.id = props.rowData.id
    payload.dictId = props.rowData.id
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
      <AFormItem :label="'字典名称'" name="dictName">
        <AInput v-model:value="model.dictName" :placeholder="'请输入字典名称'" />
      </AFormItem>
      <AFormItem :label="'字典编码'" name="dictCode">
        <AInput v-model:value="model.dictCode" :placeholder="'请输入字典编码'" />
      </AFormItem>
      <AFormItem :label="'状态'" name="status">
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
      <AFormItem :label="'备注'" name="remark">
        <ATextarea v-model:value="model.remark" :placeholder="'请输入备注'" :rows="3" />
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
