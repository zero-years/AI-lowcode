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
import type { MaterialSchema } from '@/materials/types'
import { storeToRefs } from 'pinia'
import 'vue3-sketch-ruler/lib/style.css'
import { debounce } from '@/utils'

defineOptions({
  name: 'CanvasRoot',
})

const editorStore = UseEditorStore()

const { nodes, selectedNodeIds } = storeToRefs(editorStore)

const moveableRef = useTemplateRef('moveable')
const stageRef = useTemplateRef('stage')
const canvasRootRef = useTemplateRef('canvasRoot')

const vm = getCurrentInstance()

const canvasWidth = ref(1920)
const canvasHeight = ref(1080)

const canvasStyle = computed(() => {
  return {
    width: canvasWidth.value + 'px',
    height: canvasHeight.value + 'px',
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
    selectedTarget.value = ids.map((id) => stageRef.value.querySelector(`[data-node-id='${id}']`))
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
        <div
          class="canvas_node"
          v-for="(node, index) in nodes"
          :key="node.id"
          :style="getNodeStyle(node, index)"
          :data-node-id="node.id"
          @mousedown="onSelect(node, $event)"
        >
          <component :is="getMaterialComponent(node.type)" :schema="node"> </component>
        </div>
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
    background: my-color-mix(--bg-color, 30%);

    .canvas_node {
      position: absolute;
    }
  }
}
</style>
