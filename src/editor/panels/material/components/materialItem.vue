<script setup lang="ts">
defineOptions({
  name: 'MaterialItem',
})
</script>

<template>
  <div class="material_item">
    <div class="title">物料</div>
    <div class="icon">
      <Icon icon="streamline-color:graph-flat" width="64"></Icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.material_item {
  height: 120px;
  padding: 10px;
  background: my-color-mix(--bg-color, 30%);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #ffffff82;
    transition: all 0.2s;
  }

  .title {
    height: 24px;
    font-size: 14px;
    border-bottom: 1px solid var(--border-color);
  }

  .icon {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
