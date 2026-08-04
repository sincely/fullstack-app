<script setup>
import { VueDraggable } from 'vue-draggable-plus'

defineOptions({
  name: 'TableColumnSetting'
})
const columns = defineModel('columns', {
  required: true
})
</script>

<template>
  <a-popover placement="bottomRight" trigger="click">
    <a-button size="small">
      <div class="flex-y-center gap-8px">
        <icon-ant-design-setting-outlined class="text-icon" />
        <span>{{ '列设置' }}</span>
      </div>
    </a-button>
    <template #content>
      <VueDraggable v-model="columns">
        <div
          v-for="item in columns"
          :key="item.key"
          class="h-36px flex-y-center rd-4px hover:(bg-primary bg-opacity-20)"
        >
          <icon-mdi-drag class="mr-8px cursor-move text-icon" />
          <a-checkbox v-model:checked="item.checked">
            {{ item.title }}
          </a-checkbox>
        </div>
      </VueDraggable>
    </template>
  </a-popover>
</template>
