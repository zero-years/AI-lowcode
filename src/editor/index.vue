<script setup lang="ts">
import ToolbarLeft from './toolbar/toolbarLeft.vue'
import ToolbarRight from './toolbar/toolbarRight.vue'
import MaterialPanel from './panels/material/index.vue'
import LayerPanel from './panels/layer/index.vue'
import CanvasRoot from './canvas/index.vue'
import PropertyPanel from './property/index.vue'

import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'ScreenEditor',
})

const editorStore = UseEditorStore()

const { dataSources, panelVisible } = storeToRefs(editorStore)

provide('dataSources', dataSources)

const materialWidth = computed(() => (panelVisible.value.material ? '260px' : '0px'))
const layerWidth = computed(() => (panelVisible.value.layer ? '160px' : '0px'))
const propertyWidth = computed(() => (panelVisible.value.property ? '360px' : '0px'))
</script>

<template>
  <div class="editor h-screen select-none">
    <header class="header h-56 flex items-center px-20">
      <ToolbarLeft class="w-300" />
      <div class="flex-1 text-center">中</div>
      <ToolbarRight class="w-300" />
    </header>
    <main class="h-[calc(100vh-56px)] flex">
      <!-- 物料 -->
      <MaterialPanel
        class="material overflow-hidden transition-all"
        :style="{ width: materialWidth }"
      />

      <!-- 图层 -->
      <LayerPanel class="layer overflow-hidden transition-all" :style="{ width: layerWidth }" />

      <!-- 画布 -->
      <CanvasRoot class="canvas flex-1" />

      <!-- 属性 -->
      <PropertyPanel
        class="property overflow-hidden transition-all"
        :style="{ width: propertyWidth }"
      ></PropertyPanel>
    </main>
  </div>
</template>

<style scoped lang="scss">
.editor {
  background: var(--bg-color);

  .header {
    border-bottom: 1px solid var(--border-color);
  }

  .material {
    border-right: 1px solid var(--border-color);
  }

  .layer {
    border-right: 1px solid var(--border-color);
  }

  .property {
    border-left: 1px solid var(--border-color);
  }
}
</style>
