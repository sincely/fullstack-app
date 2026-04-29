<script setup>
defineOptions({
  name: 'TableHeaderOperation'
})

defineProps({
  disabledDelete: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add', 'delete', 'refresh'])

const columns = defineModel('columns', {
  default: () => []
})

function add() {
  emit('add')
}

function batchDelete() {
  emit('delete')
}

function refresh() {
  emit('refresh')
}
</script>

<template>
  <div class="flex flex-wrap justify-end gap-x-12px gap-y-8px lt-sm:(w-200px py-12px)">
    <slot name="prefix"></slot>
    <slot name="default">
      <AButton size="small" ghost type="primary" @click="add">
        <div class="flex-y-center gap-8px">
          <icon-ic-round-plus class="text-icon" />
          <span>新增</span>
        </div>
      </AButton>
      <APopconfirm :description="'确认删除吗？'" :disabled="disabledDelete" @confirm="batchDelete">
        <AButton size="small" danger :disabled="disabledDelete">
          <div class="flex-y-center gap-8px">
            <icon-ic-round-delete class="text-icon" />
            <span>批量删除</span>
          </div>
        </AButton>
      </APopconfirm>
    </slot>
    <AButton size="small" @click="refresh">
      <div class="flex-y-center gap-8px">
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
        <span>刷新</span>
      </div>
    </AButton>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </div>
</template>
