<script setup>
import { createReusableTemplate } from '@vueuse/core'
import { computed } from 'vue'
defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false
})

const props = defineProps({
  class: {
    type: String,
    default: 'h-36px text-icon'
  },
  icon: {
    type: String,
    default: ''
  },
  tooltipContent: {
    type: String,
    default: ''
  },
  tooltipPlacement: {
    type: String,
    default: 'bottom'
  },
  triggerParent: {
    type: Boolean,
    default: false
  }
})

const [DefineButton, Button] = createReusableTemplate({
  className: ''
})

const cls = computed(() => {
  let clsStr = props.class

  if (!clsStr.includes('h-')) {
    clsStr += ' h-36px'
  }

  if (!clsStr.includes('text-')) {
    clsStr += ' text-icon'
  }

  return clsStr
})

function getPopupContainer(triggerNode) {
  return props.triggerParent ? triggerNode.parentNode : triggerNode
}
</script>

<template>
  <!-- define component start: Button -->
  <DefineButton v-slot="{ $slots, className }">
    <AButton type="text" :class="className">
      <div class="flex-center gap-8px">
        <component :is="$slots.default" />
      </div>
    </AButton>
  </DefineButton>
  <!-- define component end: Button -->

  <ATooltip
    v-if="tooltipContent"
    :placement="tooltipPlacement"
    :get-popup-container="getPopupContainer"
    :title="tooltipContent"
  >
    <Button :class-name="cls" v-bind="$attrs">
      <slot>
        <SvgIcon :icon="icon" />
      </slot>
    </Button>
  </ATooltip>
  <Button v-else :class-name="cls" v-bind="$attrs">
    <slot>
      <SvgIcon :icon="icon" />
    </slot>
  </Button>
</template>
