<script setup lang="ts">
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { getMaterialComponent } from '@/materials'
import type { MaterialSchema } from '@/schema/material.ts'
import type { PageSchema } from '@/schema/page'

defineOptions({
  name: 'ScreenRender',
})

const props = defineProps<{ page: PageSchema }>()

const canvas = computed(() => {
  return props.page.canvas
})

const dataSources = computed(() => {
  return props.page.dataSources
})

const nodes = computed(() => {
  return props.page.nodes
})

const scale = ref(1)
const left = ref(0)
const top = ref(0)

provide('dataSources', dataSources)

const canvasStyle = computed(() => {
  return {
    width: canvas.value.width + 'px',
    height: canvas.value.height + 'px',
    backgroundColor: canvas.value.backgroundColor,
    transform: `translate(${left.value}px, ${top.value}px) scale(${scale.value})`,
    transformOrigin: 'top left',
  }
})

function getNodeStyle(node: MaterialSchema, index: number) {
  return {
    width: node.layout.width + 'px',
    height: node.layout.height + 'px',
    left: node.layout.x + 'px',
    top: node.layout.y + 'px',
    zindex: index + 1,
  }
}

function initCanvas() {
  const y = window.innerHeight / canvas.value.height
  const x = window.innerWidth / canvas.value.width
  // 按最小比例进行缩放
  scale.value = Math.min(x, y)
  left.value = (window.innerWidth - canvas.value.width * scale.value) / 2
  top.value = (window.innerHeight - canvas.value.height * scale.value) / 2
}

onMounted(() => {
  initCanvas()

  addEventListener('resize', initCanvas)

  onBeforeUnmount(() => {
    removeEventListener('resize', initCanvas)
  })
})
</script>

<template>
  <div class="preview_container">
    <div class="canvas_container" :style="canvasStyle">
      <div
        class="canvas_node"
        v-for="(node, index) in nodes"
        :key="node.id"
        :style="getNodeStyle(node, index)"
      >
        <component :is="getMaterialComponent(node.type)" :schema="node"></component>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.preview_container {
  width: 100vw;
  height: 100vh;

  .canvas_container {
    position: relative;

    .canvas_node {
      position: absolute;
    }
  }
}
</style>
