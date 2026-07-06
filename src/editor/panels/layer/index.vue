<script setup lang="ts">
defineOptions({
  name: 'LayerPanel',
})
</script>

<template>
  <div class="h-full">
    <div class="h-full layer_panel overflow-auto scrollbar-none">
      <div class="active">
        <span>柱状图</span>
        <span><Icon icon="fluent:list-bar-16-regular"></Icon></span>
      </div>
      <div>
        <span>柱状图</span>
        <span><Icon icon="fluent:list-bar-16-regular"></Icon></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layer_panel {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: my-color-mix(--bg-color, 16%);
  padding: 10px;

  & > div {
    height: 34px;
    background: my-color-mix(--bg-color, 26%);
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;

    &.active {
      background: my-color-mix(--active-color, 20%);
    }
  }
}
</style>
