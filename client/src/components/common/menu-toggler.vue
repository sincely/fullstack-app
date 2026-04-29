<script setup>
import { computed } from 'vue'

defineOptions({ name: 'MenuToggler' })

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  arrowIcon: {
    type: Boolean,
    default: false
  }
})

const icon = computed(() => {
  const icons = {
    0: {
      0: 'line-md:menu-fold-left',
      1: 'line-md:menu-fold-right'
    },
    1: {
      0: 'ph-caret-double-left-bold',
      1: 'ph-caret-double-right-bold'
    }
  }

  const arrowIcon = Number(props.arrowIcon || false)

  const collapsed = Number(props.collapsed || false)

  return icons[arrowIcon][collapsed]
})
</script>

<template>
  <ButtonIcon :tooltip-content="collapsed ? '展开菜单' : '折叠菜单'" tooltip-placement="bottomLeft" trigger-parent>
    <SvgIcon :icon="icon" />
  </ButtonIcon>
</template>
