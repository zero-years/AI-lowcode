<script setup lang="ts">
import { getMaterialComponent, createNode } from '@/materials'

import type { MaterialSchema } from '@/materials/types'

defineOptions({
  name: 'CanvasRoot',
})

const nodes = ref<MaterialSchema[]>([])

function onDrop(e: DragEvent) {
  const schema = e.dataTransfer.getData('schema')
  const node = createNode(JSON.parse(schema))

  nodes.value.push(node)
}
</script>

<template>
  <div class="canvas_root">
    <div class="canvas_stage" @dragover.prevent @drop="onDrop">
      <component
        v-for="node in nodes"
        :key="node.id"
        :is="getMaterialComponent(node.type)"
        :schema="node"
      >
      </component>
    </div>
  </div>
</template>

<style scoped lang="scss">
.canvas_root {
  .canvas_stage {
    width: 900px;
    height: 600px;
    background: my-color-mix(--bg-color, 30%);
    margin: 100px;
  }
}
</style>
