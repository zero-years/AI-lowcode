<script setup lang="ts">
defineOptions({
  name: 'InfoComponent',
})

const props = defineProps(['schema'])

const textStyle = computed(() => {
  const style = props.schema.style
  return {
    ...style,
    fontSize: style.fontSize + 'px',
  }
})
</script>

<template>
  <span :style="textStyle">{{ schema.props.content }}</span>
</template>

<style scoped lang=""></style>
