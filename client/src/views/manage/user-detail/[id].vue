<script setup>
defineProps({
  id: {
    type: String,
    required: true
  }
})
</script>

<template>
  <LookForward>
    <p>{{ id }}</p>
  </LookForward>
</template>
