<script setup lang="ts">
import { getMaterialComponent, createNode } from '@/materials'
import Moveable, {
  type OnDrag,
  type OnDragGroup,
  type OnResize,
  type OnResizeGroup,
} from 'vue3-moveable'
import Selecto from 'vue3-selecto'
import { UseEditorStore } from '@/stores/editor'

import type { MaterialSchema } from '@/materials/types'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'CanvasRoot',
})

const editorStore = UseEditorStore()

const { nodes } = storeToRefs(editorStore)

const moveableRef = useTemplateRef('moveable')
const stageRef = useTemplateRef('stage')

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

function getNodeByTarget(target: HTMLElement) {
  const nodeId = target.getAttribute('data-node-id')
  return editorStore.findNodeById(nodeId)
}

function onDrag(e: OnDrag) {
  e.target.style.left = e.left + 'px'
  e.target.style.top = e.top + 'px'

  const node = getNodeByTarget(e.target as HTMLElement)

  node.layout.x = e.left
  node.layout.y = e.top
}

function onResize(e: OnResize) {
  e.target.style.width = e.width + 'px'
  e.target.style.height = e.height + 'px'
  const node = getNodeByTarget(e.target as HTMLElement)
  node.layout.width = e.width
  node.layout.height = e.height
  onDrag(e.drag)
}

function onClearSelect() {
  editorStore.clearSelected()
  selectedTarget.value = null
}

function onSelectEnd(e) {
  selectedTarget.value = e.selected
  const ids = e.selected.map((element) => element.getAttribute('data-node-id'))
  editorStore.selectNodes(ids)
}

function onDragGroup(e: OnDragGroup) {
  e.events.forEach(onDrag)
}

function onResizeGroup(e: OnResizeGroup) {
  e.events.forEach(onResize)
}
</script>

<template>
  <div class="canvas_root">
    <div
      ref="stage"
      class="canvas_stage"
      @dragover.prevent
      @drop="onDrop"
      @mousedown.self="onClearSelect"
    >
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
      @drag-group="onDragGroup"
      @resize-group="onResizeGroup"
      @resize="onResize"
    ></Moveable>
    <Selecto
      v-if="stageRef"
      :container="stageRef"
      :dragContainer="stageRef"
      :selectable-targets="['.canvas_node']"
      :select-from-inside="false"
      toggle-continue-select="shift"
      @select-end="onSelectEnd"
    ></Selecto>
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
