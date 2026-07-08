<script setup lang="ts">
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { getMaterialSetters } from '@/materials'
import FormCreate from './formCreate.vue'

defineOptions({
  name: 'PropsProperty',
})

const editorStore = UseEditorStore()
const { selectedNode } = storeToRefs(editorStore)

const setter = getMaterialSetters(selectedNode.value.type)

const layoutSetter = [
  {
    label: '宽度',
    key: 'layout.width',
    type: 'number',
    span: 12,
  },
  {
    label: '高度',
    key: 'layout.height',
    type: 'number',
    span: 12,
  },
  {
    label: 'x',
    key: 'layout.x',
    type: 'number',
    span: 12,
  },
  {
    label: 'y',
    key: 'layout.y',
    type: 'number',
    span: 12,
  },
]

const active = ref('props')
</script>

<template>
  <div class="node_collapse">
    <el-collapse v-model="active" accordion>
      <el-collapse-item title="布局属性" name="layout">
        <FormCreate :setters="layoutSetter" :formdata="selectedNode"></FormCreate>
      </el-collapse-item>
      <el-collapse-item title="属性属性" name="props">
        <FormCreate :setters="setter" :formdata="selectedNode"></FormCreate>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
.node_collapse {
  :deep(.el-collapse) {
    --el-collapse-border-color: var(--border-color);
    --el-collapse-header-height: 48px;
    --el-collapse-header-bg-color: transparent;
    --el-collapse-header-text-color: var(--el-text-color-primary);
    --el-collapse-header-font-size: 13px;
    --el-collapse-content-bg-color: transparent;
    --el-collapse-content-font-size: 13px;
    --el-collapse-content-text-color: var(--el-text-color-primary);
    border-top: 1px solid var(--el-collapse-border-color);
    border-bottom: 1px solid var(--el-collapse-border-color);

    .el-collapse-item__title {
      padding-left: 10px;
    }
  }
}
</style>
