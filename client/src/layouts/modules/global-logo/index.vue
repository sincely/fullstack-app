<script setup>
defineOptions({
  name: 'GlobalLogo'
})

defineProps({
  showTitle: {
    // “顶部菜单模式”和“顶部菜单混合模式”，因为这两种布局会在头部渲染 GlobalLogo ，
    // 而侧边菜单模式都会显式传入 show-title 为 false
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <SystemLogo class="size-32px" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out">
      Soybean 管理系统
    </h2>
  </RouterLink>
</template>
