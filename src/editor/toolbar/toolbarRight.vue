<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'ToolbarRight',
})
</script>

<template>
  <div class="toolbar_right flex justify-end gap-20">
    <span>
      <Icon icon="pajamas:live-preview" />
    </span>
    <span>
      <Icon icon="mingcute:code-fill" />
    </span>
    <span>
      <Icon icon="material-symbols:published-with-changes-rounded" />
    </span>
    <span>
      <Icon icon="pajamas:import" />
    </span>
    <span>
      <Icon icon="pajamas:export" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.toolbar_right {
  span {
    padding: 4px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
  }
}
</style>
