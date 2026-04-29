<script setup>
import { computed } from 'vue'

defineOptions({ name: 'PinToggler' })

const props = defineProps({
  pin: {
    type: Boolean,
    default: false
  }
})

const icon = computed(() => (props.pin ? 'mdi-pin-off' : 'mdi-pin'))
</script>

<template>
  <ButtonIcon :tooltip-content="pin ? '固定' : '取消固定'" tooltip-placement="bottomLeft" trigger-parent>
    <SvgIcon :icon="icon" />
  </ButtonIcon>
</template>
