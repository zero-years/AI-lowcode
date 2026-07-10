<script setup lang="ts">
import { getMaterialComponent, createNode } from '@/materials'
import Moveable from 'vue3-moveable'
import Selecto from 'vue3-selecto'
import SketchRuler from 'vue3-sketch-ruler'
import { UseEditorStore } from '@/stores/editor'
import type { MaterialSchema } from '@/schema/material.ts'
import { storeToRefs } from 'pinia'
import 'vue3-sketch-ruler/lib/style.css'
import { useCanvasRuler } from './composables/useCanvasRuler'
import { useMoveable } from './composables/useMoveable'
import { useSelection } from './composables/useSelection'

defineOptions({
  name: 'CanvasRoot',
})

const editorStore = UseEditorStore()

const { nodes } = storeToRefs(editorStore)

const moveableRef = useTemplateRef('moveable')
const stageRef = useTemplateRef('stage')
const canvasRootRef = useTemplateRef('canvasRoot')

const {
  canvasWidth,
  canvasHeight,
  canvasStyle,
  rectHeight,
  rectWidth,
  lines,
  scale,
  palette,
  onZoomChange,
} = useCanvasRuler({ canvasRootRef, moveableRef })

const { onDrag, onDragGroup, onResize, onResizeGroup, onStart, onEnd } = useMoveable(moveableRef)

const { selectedTarget, onSelect, onClearSelect, onSelectEnd } = useSelection({
  stageRef,
  moveableRef,
})

function onDrop(e: DragEvent) {
  const schema = e.dataTransfer.getData('schema')
  const node = createNode(JSON.parse(schema))

  node.layout.x = e.offsetX - node.layout.width / 2
  node.layout.y = e.offsetY - node.layout.height / 2

  editorStore.addNode(node)

  editorStore.selectNode(node.id)
}

function getNodeStyle(node: MaterialSchema, index: number) {
  return {
    width: node.layout.width + 'px',
    height: node.layout.height + 'px',
    left: node.layout.x + 'px',
    top: node.layout.y + 'px',
    zindex: index + 1,
  }
}

const commandMap = {
  copy: () => editorStore.copyNode(editorStore.selectedNode),
  remove: () => editorStore.removeNode(editorStore.selectedNode),
  moveButtom: () => editorStore.moveTop(editorStore.selectedNode),
  moveTop: () => editorStore.moveBottom(editorStore.selectedNode),
  toggleLock: () => {
    editorStore.toggleLock(editorStore.selectedNode)
    selectedTarget.value = []
  },
}

function onCommand(command: string) {
  commandMap[command]()
}
</script>

<template>
  <div class="canvas_root" ref="canvasRoot">
    <SketchRuler
      v-model:scale="scale"
      :thick="20"
      :palette="palette"
      :width="rectWidth"
      :height="rectHeight"
      :canvasWidth="canvasWidth"
      :canvasHeight="canvasHeight"
      :lines="lines"
      @zoomchange="onZoomChange"
    >
      <div
        ref="stage"
        class="canvas_stage"
        :style="canvasStyle"
        @dragover.prevent
        @drop="onDrop"
        @mousedown.self="onClearSelect"
      >
        <el-dropdown
          v-for="(node, index) in nodes"
          :key="node.id"
          trigger="contextmenu"
          @command="onCommand"
        >
          <div
            class="canvas_node"
            :style="getNodeStyle(node, index)"
            :data-node-id="node.id"
            :data-node-locked="node.locked"
            @mousedown="onSelect(node, $event)"
          >
            <component :is="getMaterialComponent(node.type)" :schema="node"> </component>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="copy">复制</el-dropdown-item>
              <el-dropdown-item command="remove">删除</el-dropdown-item>
              <el-dropdown-item command="moveTop">置顶</el-dropdown-item>
              <el-dropdown-item command="moveButtom">置底</el-dropdown-item>
              <el-dropdown-item command="toggleLock">{{
                node.locked ? '解锁' : '锁定'
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </SketchRuler>

    <Moveable
      ref="moveable"
      :target="selectedTarget"
      :draggable="true"
      :origin="false"
      :resizable="true"
      @drag="onDrag"
      @drag-start="onStart"
      @drag-end="onEnd"
      @drag-group="onDragGroup"
      @drag-group-start="onStart"
      @drag-group-end="onEnd"
      @resize-group="onResizeGroup"
      @resize-group-start="onStart"
      @resize-group-end="onEnd"
      @resize="onResize"
      @resize-start="onStart"
      @resize-end="onEnd"
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

    .canvas_node {
      position: absolute;
    }
  }
}
</style>
