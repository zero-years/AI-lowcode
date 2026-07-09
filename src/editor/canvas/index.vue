<script setup lang="ts">
import { getMaterialComponent, createNode } from '@/materials'
import Moveable, {
  type OnDrag,
  type OnDragGroup,
  type OnResize,
  type OnResizeGroup,
} from 'vue3-moveable'
import Selecto from 'vue3-selecto'
import SketchRuler from 'vue3-sketch-ruler'
import { UseEditorStore } from '@/stores/editor'
import type { MaterialSchema } from '@/schema/material.ts'
import { storeToRefs } from 'pinia'
import 'vue3-sketch-ruler/lib/style.css'
import { debounce } from '@/utils'

defineOptions({
  name: 'CanvasRoot',
})

const editorStore = UseEditorStore()

const { nodes, selectedNodeIds, canvas } = storeToRefs(editorStore)

const moveableRef = useTemplateRef('moveable')
const stageRef = useTemplateRef('stage')
const canvasRootRef = useTemplateRef('canvasRoot')

const canvasWidth = toRef(canvas.value, 'width')
const canvasHeight = toRef(canvas.value, 'height')

const canvasStyle = computed(() => {
  return {
    width: canvasWidth.value + 'px',
    height: canvasHeight.value + 'px',
    backgroundColor: canvas.value.backgroundColor,
  }
})

const rectWidth = ref(1000)
const rectHeight = ref(800)
const lines = ref({ h: [], v: [] })
const scale = ref(1)

const palette = {
  bgColor: '#212329',
  longfgColor: '#6b7280',
  fontColor: '#9ca3af',
  fontShadowColor: '#0e8da7',
  shadowColor: 'rgba(14, 141, 167, 0.14)',
  lineColor: '#22c55e',
  lineType: 'solid',
  lockLineColor: '#4b5563',
  borderColor: '#374151',
  hoverBg: '#111827',
  hoverColor: '#ffffff',
}

// 选中修改的元素
const selectedTarget = shallowRef<HTMLElement[]>()

watch(
  selectedNodeIds,
  (ids) => {
    selectedTarget.value = ids.map((id) =>
      stageRef.value.querySelector(`[data-node-id='${id}']:not([data-node-locked='true'])`),
    )
  },
  { deep: true, flush: 'post' },
)

const onRootResize = debounce((rect) => {
  rectWidth.value = rect.width
  rectHeight.value = rect.height
}, 3000)

onMounted(() => {
  const { width, height } = canvasRootRef.value.getBoundingClientRect()
  rectWidth.value = width
  rectHeight.value = height

  const ob = new ResizeObserver((entires) => {
    const entry = entires[0]
    const rect = entry.contentRect
    onRootResize(rect)
  })

  ob.observe(canvasRootRef.value)

  onUnmounted(() => {
    ob.disconnect()
  })
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

function onSelect(node: MaterialSchema, e: MouseEvent) {
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
}

function onSelectEnd(e) {
  const ids = e.selected.map((element) => element.getAttribute('data-node-id'))
  editorStore.selectNodes(ids)
}

function onDragGroup(e: OnDragGroup) {
  e.events.forEach(onDrag)
}

function onResizeGroup(e: OnResizeGroup) {
  e.events.forEach(onResize)
}

function onZoomChange() {
  moveableRef.value.updateRect()
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

    .canvas_node {
      position: absolute;
    }
  }
}
</style>
