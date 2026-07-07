<script setup lang="ts">
import { getMaterialComponent, createNode } from '@/materials'
import Moveable, { type OnDrag, type OnResize } from 'vue3-moveable'
import { UseEditorStore } from '@/stores/editor'

import type { MaterialSchema } from '@/materials/types'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'CanvasRoot',
})

const editorStore = UseEditorStore()

const { nodes, selectedNodeId, selectedNode } = storeToRefs(editorStore)

const moveableRef = useTemplateRef('moveable')

const vm = getCurrentInstance()

// 选中修改的元素
const selectedTarget = shallowRef()

function onDrop(e: DragEvent) {
  const schema = e.dataTransfer.getData('schema')
  const node = createNode(JSON.parse(schema))

  node.layout.x = e.offsetX - node.layout.width / 2
  node.layout.y = e.offsetY - node.layout.height / 2

  editorStore.addNode(node)

  editorStore.selectNode(node.id)

  nextTick(() => {
    selectedTarget.value = vm.proxy.$el.querySelector(`[data-node-id='${node.id}']`)
  })
}

function getNodeStyle(node: MaterialSchema) {
  return {
    width: node.layout.width + 'px',
    height: node.layout.height + 'px',
    left: node.layout.x + 'px',
    top: node.layout.y + 'px',
  }
}

function onSelect(node: MaterialSchema, e: MouseEvent) {
  selectedTarget.value = e.currentTarget as HTMLElement
  editorStore.selectNode(node.id)

  nextTick(() => {
    moveableRef.value.dragStart(e)
  })
}

function onDrag(e: OnDrag) {
  selectedTarget.value.style.left = e.left + 'px'
  selectedTarget.value.style.top = e.top + 'px'
  selectedNode.value.layout.x = e.left
  selectedNode.value.layout.y = e.top
}

function onResize(e: OnResize) {
  selectedTarget.value.style.width = e.width + 'px'
  selectedTarget.value.style.height = e.height + 'px'
  selectedNode.value.layout.width = e.width
  selectedNode.value.layout.height = e.height
  onDrag(e.drag)
}

function onClearSelect() {
  editorStore.clearSelected()
  selectedTarget.value = null
}
</script>

<template>
  <div class="canvas_root">
    <div class="canvas_stage" @dragover.prevent @drop="onDrop" @mousedown.self="onClearSelect">
      <div
        class="canvas_node"
        v-for="node in nodes"
        :key="node.id"
        :style="getNodeStyle(node)"
        :data-node-id="node.id"
        @mousedown="onSelect(node, $event)"
      >
        <component :is="getMaterialComponent(node.type)" :schema="node"> </component>
      </div>
    </div>
    <Moveable
      ref="moveable"
      :target="selectedTarget"
      :draggable="true"
      :origin="false"
      :resizable="true"
      @drag="onDrag"
      @resize="onResize"
    ></Moveable>
  </div>
</template>

<style scoped lang="scss">
.canvas_root {
  .canvas_stage {
    position: relative;
    width: 900px;
    height: 600px;
    background: my-color-mix(--bg-color, 30%);
    margin: 100px;

    .canvas_node {
      position: absolute;
    }
  }
}
</style>
