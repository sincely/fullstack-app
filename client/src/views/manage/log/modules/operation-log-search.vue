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
  <ACard :title="'搜索'" :bordered="false" class="card-wrapper">
    <AForm :model="model" :label-width="80">
      <ARow :gutter="[16, 16]" wrap>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="'操作用户'" name="username" class="m-0">
            <AInput v-model:value="model.username" :placeholder="'请输入操作用户'" allow-clear />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="'系统模块'" name="module" class="m-0">
            <ASelect v-model:value="model.module" :placeholder="'请选择系统模块'" allow-clear>
              <ASelectOption value="用户管理">用户管理</ASelectOption>
              <ASelectOption value="角色管理">角色管理</ASelectOption>
              <ASelectOption value="菜单管理">菜单管理</ASelectOption>
              <ASelectOption value="用户认证">用户认证</ASelectOption>
              <ASelectOption value="路由管理">路由管理</ASelectOption>
              <ASelectOption value="日志管理">日志管理</ASelectOption>
            </ASelect>
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="'操作状态'" name="status" class="m-0">
            <ASelect v-model:value="model.status" :placeholder="'请选择操作状态'" allow-clear>
              <ASelectOption value="1">成功</ASelectOption>
              <ASelectOption value="0">失败</ASelectOption>
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
