<script setup>
defineOptions({
  name: 'OperationLogSearch'
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
          <a-form-item :label="'操作用户'" name="username" class="m-0">
            <a-input v-model:value="model.username" :placeholder="'请输入操作用户'" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item :label="'系统模块'" name="module" class="m-0">
            <a-select v-model:value="model.module" :placeholder="'请选择系统模块'" allow-clear>
              <a-select-option value="用户管理">用户管理</a-select-option>
              <a-select-option value="角色管理">角色管理</a-select-option>
              <a-select-option value="菜单管理">菜单管理</a-select-option>
              <a-select-option value="用户认证">用户认证</a-select-option>
              <a-select-option value="路由管理">路由管理</a-select-option>
              <a-select-option value="日志管理">日志管理</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12" :lg="6">
          <a-form-item :label="'操作状态'" name="status" class="m-0">
            <a-select v-model:value="model.status" :placeholder="'请选择操作状态'" allow-clear>
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
