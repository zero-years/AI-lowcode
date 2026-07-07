<script setup lang="ts">
import MaterialItem from './components/materialItem.vue'

import { getMaterialByGroup, getMaterialGroups } from '@/materials/index.ts'

defineOptions({
  name: 'MaterialPanel',
})

const activeGroup = ref('info')

const groups = getMaterialGroups()

const currentMaterial = computed(() => {
  return getMaterialByGroup(activeGroup.value)
})
</script>

<template>
  <div class="material_panel flex">
    <div class="navigater w-50">
      <div
        :class="{ active: activeGroup == group.key }"
        v-for="group in groups"
        :key="group.key"
        @click="activeGroup = group.key"
      >
        <span><Icon :icon="group.icon" width="16"></Icon> </span>
        {{ group.name }}
      </div>
    </div>
    <div class="flex-1 p-10 flex gap-10 flex-col overflow-auto scrollbar-none">
      <MaterialItem
        v-for="item in currentMaterial"
        :key="item.name"
        :material="item"
      ></MaterialItem>
    </div>
  </div>
</template>

<style scoped lang="scss">
.material_panel {
  background: my-color-mix(--bg-color, 10%);

  .navigater {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-color);

    div {
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2px;
      font-size: 14px;
      cursor: pointer;
      &.active {
        background: my-color-mix(--active-color, 10%);
      }
    }
  }
}
</style>
