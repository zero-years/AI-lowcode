<script setup lang="ts">
defineOptions({
  name: 'ChartMaterial',
})

defineProps(['schema'])
</script>

<template>
  <div>{{ schema.name }}</div>
</template>

<style scoped lang=""></style>
