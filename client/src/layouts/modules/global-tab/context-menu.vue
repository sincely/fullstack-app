<script setup>
import { computed } from 'vue'

import { useTabStore } from '@/store/modules/tab'

defineOptions({
  name: 'ContextMenu'
})

const props = defineProps({
  tabId: {
    type: String,
    required: true
  },
  trigger: {
    type: Array,
    default: () => ['contextmenu']
  },
  excludeKeys: {
    type: Array,
    default: () => []
  },
  disabledKeys: {
    type: Array,
    default: () => []
  }
})

const { removeTab, clearTabs, clearLeftTabs, clearRightTabs } = useTabStore()

const options = computed(() => {
  const opts = [
    {
      key: 'closeCurrent',
      label: '关闭',
      icon: 'ant-design:close-outlined'
    },
    {
      key: 'closeOther',
      label: '关闭其它',
      icon: 'ant-design:column-width-outlined'
    },
    {
      key: 'closeLeft',
      label: '关闭左侧',
      icon: 'mdi:format-horizontal-align-left'
    },
    {
      key: 'closeRight',
      label: '关闭右侧',
      icon: 'mdi:format-horizontal-align-right'
    },
    {
      key: 'closeAll',
      label: '关闭所有',
      icon: 'ant-design:line-outlined'
    }
  ]
  const { excludeKeys, disabledKeys } = props

  const result = opts.filter((opt) => !excludeKeys.includes(opt.key))

  disabledKeys.forEach((key) => {
    const opt = result.find((item) => item.key === key)

    if (opt) {
      opt.disabled = true
    }
  })

  return result
})

const dropdownAction = {
  closeCurrent() {
    removeTab(props.tabId)
  },
  closeOther() {
    clearTabs([props.tabId])
  },
  closeLeft() {
    clearLeftTabs(props.tabId)
  },
  closeRight() {
    clearRightTabs(props.tabId)
  },
  closeAll() {
    clearTabs()
  }
}
</script>

<template>
  <ADropdown :trigger="trigger" placement="bottom" destroy-popup-on-hide>
    <slot></slot>
    <template #overlay>
      <AMenu>
        <AMenuItem
          v-for="option in options"
          :key="option.key"
          :disabled="option.disabled"
          @click="dropdownAction[option.key]"
        >
          <div class="flex-y-center gap-12px">
            <SvgIcon :icon="option.icon" class="text-icon" />
            <span>{{ option.label }}</span>
          </div>
        </AMenuItem>
      </AMenu>
    </template>
  </ADropdown>
</template>
