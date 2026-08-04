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
  <a-card :title="'搜索'" :bordered="false" class="card-wrapper">
    <a-form :model="model" :label-width="80">
      <a-row :gutter="[16, 16]" wrap>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item :label="'角色名称'" name="roleName" class="m-0">
            <a-input v-model:value="model.roleName" :placeholder="'请输入角色名称'" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item :label="'角色编码'" name="roleCode" class="m-0">
            <a-input v-model:value="model.roleCode" :placeholder="'请输入角色编码'" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item :label="'角色状态'" name="status" class="m-0">
            <a-select v-model:value="model.status" :placeholder="'请选择角色状态'" allow-clear>
              <a-select-option v-for="option in enableStatusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item class="m-0">
            <div class="w-full flex-y-center justify-end gap-12px">
              <a-button @click="reset">
                <div class="flex-y-center gap-8px">
                  <icon-ic-round-refresh class="text-icon" />
                  <span>{{ '重置' }}</span>
                </div>
              </a-button>
              <a-button type="primary" ghost @click="search">
                <div class="flex-y-center gap-8px">
                  <icon-ic-round-search class="text-icon" />
                  <span>{{ '搜索' }}</span>
                </div>
              </a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>
