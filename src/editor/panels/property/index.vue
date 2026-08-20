<script setup lang="ts">
import { storeToRefs } from 'pinia'
import CanvasProperty from './component/canvasProperty.vue'
import PropsProperty from './component/propsProperty.vue'
import { UseEditorStore } from '@/stores/editor.ts'

defineOptions({
  name: 'PropertyPanel',
})

const editorStore = UseEditorStore()
const { selectedNode } = storeToRefs(editorStore)
</script>

<template>
  <div>
    <PropsProperty v-if="selectedNode" />
    <CanvasProperty v-else />
  </div>
</template>

<style scoped lang="  "></style>
