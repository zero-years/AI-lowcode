<script setup lang="ts">
defineOptions({
  name: 'ScreenEditor',
})
</script>

<template>
  <div class="editor h-screen">
    <header class="header h-56"></header>
    <main class="h-[calc(100vh-56px)] flex">
      <!-- 物料 -->
      <aside class="material w-260">物料</aside>

      <!-- 图层 -->
      <aside class="layer w-156">图层</aside>

      <!-- 画布 -->
      <aside class="canvas flex-1">画布</aside>

      <!-- 属性 -->
      <aside class="property w-260">属性</aside>
    </main>
  </div>
</template>

<style scoped lang="scss">
.editor {
  --border-color: #3f4451;
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
