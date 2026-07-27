<script setup lang="ts">
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { useDraggable } from 'vue-draggable-plus'

defineOptions({
  name: 'LayerPanel',
})

const editerStore = UseEditorStore()

const { nodes, selectedNodeIds } = storeToRefs(editerStore)

useDraggable('.layer_panel', nodes, { animation: 300, direction: 'horizontal' })
</script>

<template>
  <div class="h-full">
    <div class="h-full layer_panel overflow-auto scrollbar-none flex flex-col-reverse justify-end">
      <div
        :class="{ active: selectedNodeIds.includes(node.id) }"
        v-for="node in nodes"
        :key="node.id"
        @click="editerStore.selectNode(node.id)"
      >
        <span>{{ node.name }}</span>
        <span><Icon icon="fluent:list-bar-16-regular"></Icon></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layer_panel {
  display: flex;
  gap: 4px;
  background: my-color-mix(--bg-color, 16%);
  padding: 10px;

  & > div {
    height: 34px;
    background: my-color-mix(--bg-color, 26%);
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;

    &.active {
      background: my-color-mix(--active-color, 20%);
    }
  }
}
</style>
