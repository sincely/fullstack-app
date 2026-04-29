<script setup>
import 'simplebar-vue/dist/simplebar.min.css'

import Simplebar from 'simplebar-vue'

defineOptions({
  name: 'SimpleScrollbar'
})
</script>

<template>
  <div class="h-full flex-1-hidden">
    <Simplebar class="h-full">
      <slot />
    </Simplebar>
  </div>
</template>
