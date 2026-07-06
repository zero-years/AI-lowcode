<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { UseEditorStore } from '@/stores/editor'

defineOptions({
  name: 'ToolbarLeft',
})

const { panelVisible, togglePanel } = UseEditorStore()
</script>

<template>
  <div class="toolbar_left flex gap-20">
    <span :class="{ active: panelVisible.material }" @click="togglePanel('material')">
      <Icon icon="fluent:panel-left-16-filled" />
    </span>
    <span :class="{ active: panelVisible.layer }" @click="togglePanel('layer')">
      <Icon icon="glyphs:layer-group-bold" />
    </span>
    <span :class="{ active: panelVisible.property }" @click="togglePanel('property')">
      <Icon icon="fluent:panel-right-16-filled" />
    </span>
    <span>
      <Icon icon="material-symbols:undo-rounded" />
    </span>
    <span>
      <Icon icon="material-symbols:redo-rounded" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.toolbar_left {
  span {
    padding: 4px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
    &.active {
      background: var(--active-color);
    }
  }
}
</style>
