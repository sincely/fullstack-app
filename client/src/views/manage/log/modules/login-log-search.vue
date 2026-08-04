<script setup>
defineOptions({
  name: 'LoginLogSearch'
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
          <a-form-item :label="'用户名'" name="username" class="m-0">
            <a-input v-model:value="model.username" :placeholder="'请输入用户名'" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item :label="'IP地址'" name="ipAddress" class="m-0">
            <a-input v-model:value="model.ipAddress" :placeholder="'请输入IP地址'" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item :label="'登录状态'" name="status" class="m-0">
            <a-select v-model:value="model.status" :placeholder="'请选择登录状态'" allow-clear>
              <a-select-option value="1">成功</a-select-option>
              <a-select-option value="0">失败</a-select-option>
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
