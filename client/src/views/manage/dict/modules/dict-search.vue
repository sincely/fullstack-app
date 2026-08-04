<script setup>
import { enableStatusOptions } from '@/constants/business'

defineOptions({
  name: 'DictSearch'
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
          <a-form-item :label="'字典名称'" name="dictName" class="m-0">
            <a-input v-model:value="model.dictName" :placeholder="'请输入字典名称'" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item :label="'字典编码'" name="dictCode" class="m-0">
            <a-input v-model:value="model.dictCode" :placeholder="'请输入字典编码'" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item :label="'状态'" name="status" class="m-0">
            <a-select v-model:value="model.status" :placeholder="'请选择状态'" allow-clear>
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
