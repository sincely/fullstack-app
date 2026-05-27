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
  <ACard :title="'搜索'" :bordered="false" class="card-wrapper">
    <AForm :model="model" :label-width="80">
      <ARow :gutter="[16, 16]" wrap>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="'用户名'" name="username" class="m-0">
            <AInput v-model:value="model.username" :placeholder="'请输入用户名'" allow-clear />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="'IP地址'" name="ipAddress" class="m-0">
            <AInput v-model:value="model.ipAddress" :placeholder="'请输入IP地址'" allow-clear />
          </AFormItem>
        </ACol>
        <ACol :span="24" :md="12" :lg="6">
          <AFormItem :label="'登录状态'" name="status" class="m-0">
            <ASelect v-model:value="model.status" :placeholder="'请选择登录状态'" allow-clear>
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
