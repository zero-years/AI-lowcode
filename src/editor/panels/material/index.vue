<script setup lang="ts">
import MaterialItem from './components/materialItem.vue'

defineOptions({
  name: 'MaterialPanel',
})
</script>

<template>
  <div class="material_panel flex">
    <div class="navigater w-50">
      <div class="active">
        <span><Icon icon="codicon:graph" width="16"></Icon> </span>
        图表
      </div>

      <div>
        <span><Icon icon="ant-design:form-outlined" width="16"></Icon></span>
        表单
      </div>
    </div>
    <div class="flex-1 p-10 flex gap-10 flex-col overflow-auto scrollbar-none">
      <MaterialItem v-for="item in 20"></MaterialItem>
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
