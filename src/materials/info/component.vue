<script setup lang="ts">
defineOptions({
  name: 'InfoComponent',
})

defineProps(['schema'])
</script>

<template>
  <span :style="schema.style">{{ schema.props.content }}</span>
</template>

<style scoped lang=""></style>
