<script setup lang="ts">
defineOptions({
  name: 'MaterialItem',
})

const props = defineProps(['material'])

function onDragStrat(e: DragEvent) {
  e.dataTransfer.setData('schema', JSON.stringify(props.material.schema))
}
</script>

<template>
  <div class="material_item" draggable="true" @dragstart="onDragStrat">
    <div class="title">{{ material.name }}</div>
    <div class="icon">
      <Icon :icon="material.icon" width="64"></Icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.material_item {
  height: 120px;
  padding: 10px;
  background: my-color-mix(--bg-color, 30%);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #ffffff82;
    transition: all 0.2s;
  }

  .title {
    height: 24px;
    font-size: 14px;
    border-bottom: 1px solid var(--border-color);
  }

  .icon {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
