<script setup lang="ts">
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import ScreenRender from '@/components/ScreenRender/index.vue'

defineOptions({
  name: 'ScreenPreview',
})

const editorStore = UseEditorStore()

// 点击预览，数据从 editorStore 中获取
const { page } = storeToRefs(editorStore)
</script>

<template>
  <ScreenRender :page="page"></ScreenRender>
</template>
