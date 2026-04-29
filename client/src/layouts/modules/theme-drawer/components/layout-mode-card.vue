<script setup>
import { themeLayoutModeRecord } from '@/constants/app'

defineOptions({
  name: 'LayoutModeCard'
})

const props = defineProps({
  mode: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:mode'])
const layoutConfig = {
  vertical: {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-1/3 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  'vertical-mix': {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-1/4 h-full',
    mainClass: 'w-2/3 h-3/4'
  },
  horizontal: {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-full h-3/4'
  },
  'horizontal-mix': {
    placement: 'bottom',
    headerClass: '',
    menuClass: 'w-full h-1/4',
    mainClass: 'w-2/3 h-3/4'
  }
}

function handleChangeMode(mode) {
  if (props.disabled) return

  emit('update:mode', mode)
}
</script>

<template>
  <div class="flex-center flex-wrap gap-x-32px gap-y-16px">
    <div
      v-for="(item, key) in layoutConfig"
      :key="key"
      class="flex cursor-pointer border-2px rounded-6px hover:border-primary"
      :class="[mode === key ? 'border-primary' : 'border-transparent']"
      @click="handleChangeMode(key)"
    >
      <ATooltip :placement="item.placement" :title="themeLayoutModeRecord[key]">
        <div
          class="h-64px w-96px gap-6px rd-4px p-6px shadow dark:shadow-coolGray-5"
          :class="[key.includes('vertical') ? 'flex' : 'flex-col']"
        >
          <slot :name="key"></slot>
        </div>
      </ATooltip>
    </div>
  </div>
</template>
