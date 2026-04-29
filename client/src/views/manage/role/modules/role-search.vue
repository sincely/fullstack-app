<script setup>
import { enableStatusOptions } from '@/constants/business'

defineOptions({
  name: 'RoleSearch'
})

const emit = defineEmits(['reset', 'search'])

const model = defineModel('model', { required: true })

function reset() {
  emit('reset')
}

function search() {
  emit('search')
}
</script>

<template>
  <ACard :title="'搜索'" :bordered="false" class="card-wrapper">
    <AForm :model="model" :label-width="80">
      <ARow :gutter="[16, 16]" wrap>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="'角色名称'" name="roleName" class="m-0">
            <AInput v-model:value="model.roleName" :placeholder="'请输入角色名称'" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="'角色编码'" name="roleCode" class="m-0">
            <AInput v-model:value="model.roleCode" :placeholder="'请输入角色编码'" />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="'角色状态'" name="status" class="m-0">
            <ASelect v-model:value="model.status" :placeholder="'请选择角色状态'" allow-clear>
              <ASelectOption v-for="option in enableStatusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </ASelectOption>
            </ASelect>
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem class="m-0">
            <div class="w-full flex-y-center justify-end gap-12px">
              <AButton @click="reset">
                <div class="flex-y-center gap-8px">
                  <icon-ic-round-refresh class="text-icon" />
                  <span>{{ '重置' }}</span>
                </div>
              </AButton>
              <AButton type="primary" ghost @click="search">
                <div class="flex-y-center gap-8px">
                  <icon-ic-round-search class="text-icon" />
                  <span>{{ '搜索' }}</span>
                </div>
              </AButton>
            </div>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </ACard>
</template>
