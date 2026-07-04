<script setup lang="ts">
import ToolbarLeft from './toolbar/toolbarLeft.vue'
import ToolbarRight from './toolbar/toolbarRight.vue'
import { UseEditorStore } from '@/stores/editor'

defineOptions({
  name: 'ScreenEditor',
})

const { panelVisible } = UseEditorStore()

const materialWidth = computed(() => (panelVisible.material ? '260px' : '0px'))
const layerWidth = computed(() => (panelVisible.layer ? '160px' : '0px'))
const propertyWidth = computed(() => (panelVisible.property ? '260px' : '0px'))
</script>

<template>
  <div class="editor h-screen">
    <header class="header h-56 flex items-center px-20">
      <ToolbarLeft class="w-300">左</ToolbarLeft>
      <div class="flex-1 text-center">中</div>
      <ToolbarRight class="w-300">右</ToolbarRight>
    </header>
    <main class="h-[calc(100vh-56px)] flex">
      <!-- 物料 -->
      <aside class="material overflow-hidden transition-all" :style="{ width: materialWidth }">
        物料
      </aside>

      <!-- 图层 -->
      <aside class="layer overflow-hidden transition-all" :style="{ width: layerWidth }">
        图层
      </aside>

      <!-- 画布 -->
      <aside class="canvas flex-1">画布</aside>

      <!-- 属性 -->
      <aside class="property overflow-hidden transition-all" :style="{ width: propertyWidth }">
        属性
      </aside>
    </main>
  </div>
</template>

<style scoped lang="scss">
.editor {
  background: #24272e;

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
