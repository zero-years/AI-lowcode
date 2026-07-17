<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { UseEditorStore } from '@/stores/editor'
import { useUndoRedo } from '@/composables/useUndoRedo'

defineOptions({
  name: 'ToolbarLeft',
})

const { panelVisible, togglePanel } = UseEditorStore()

const { undo, redo, canRedo, canUndo } = useUndoRedo()
</script>

<template>
  <div class="toolbar_left flex gap-20">
    <span :class="{ active: panelVisible.material }" @click="togglePanel('material')">
      <Icon icon="fluent:panel-left-16-filled" />
      <span class="hoveBox">物料</span>
    </span>
    <span :class="{ active: panelVisible.layer }" @click="togglePanel('layer')">
      <Icon icon="glyphs:layer-group-bold" />
      <span class="hoveBox">图层</span>
    </span>
    <span :class="{ active: panelVisible.property }" @click="togglePanel('property')">
      <Icon icon="fluent:panel-right-16-filled" />
      <span class="hoveBox">属性</span>
    </span>
    <span @click="undo" :class="{ disable: !canUndo }">
      <Icon icon="material-symbols:undo-rounded" />
    </span>
    <span @click="redo" :class="{ disable: !canRedo }">
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

    &.disable {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .hoveBox {
      position: absolute;
      font-size: 12px;
      transform: translateY(6px) translateX(-25%);
      opacity: 0;
      transition: all 0.2s;
      text-align: center;
    }

    &:hover {
      .hoveBox {
        opacity: 1;
      }
    }
  }
}
</style>
