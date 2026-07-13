<script setup lang="ts">
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { getMaterialSetters } from '@/materials'
import FormCreate from './formCreate.vue'
import { Icon } from '@iconify/vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import DataSource from './dataSource.vue'

defineOptions({
  name: 'PropsProperty',
})

const editorStore = UseEditorStore()
const { selectedNode } = storeToRefs(editorStore)

const setter = computed(() => getMaterialSetters(selectedNode.value.type))

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

const visiable = ref(false)
const jsonText = ref('')
const activeTab = ref('property')

function previewJson() {
  jsonText.value = JSON.stringify(selectedNode.value, null, 2)
  visiable.value = true
}

function onConfirm() {
  // 拿到新节点更新
  const newNode = JSON.parse(jsonText.value)

  editorStore.updateNode(selectedNode.value.id, {
    ...newNode,
    // id 和 type 不允许修改
    id: selectedNode.value.id,
    type: selectedNode.value.type,
  })

  visiable.value = false
}
</script>

<template>
  <div class="node_collapse">
    <div class="node_title">
      <span>{{ selectedNode.name }}</span>
      <span class="cursor-pointer" @click="previewJson">
        <Icon icon="mingcute:code-fill" />
      </span>
    </div>

    <el-tabs v-model="activeTab" stretch>
      <el-tab-pane label="属性" name="property">
        <el-collapse v-model="active" accordion>
          <el-collapse-item title="布局属性" name="layout">
            <FormCreate :setters="layoutSetter" :formdata="selectedNode"></FormCreate>
          </el-collapse-item>
          <el-collapse-item title="属性属性" name="props">
            <FormCreate :setters="setter" :formdata="selectedNode"></FormCreate>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="数据源" name="datasource">
        <DataSource />
      </el-tab-pane>
    </el-tabs>

    <el-drawer :destroy-on-close="true" v-model="visiable" size="800" title="编辑JSON">
      <MonacoEditor v-model="jsonText" />

      <template #footer>
        <el-button @click="visiable = false">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.node_collapse {
  .node_title {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: my-color-mix(--bg-color, 20%);
    padding-left: 10px;
    padding-right: 20px;
    font-weight: 600;
  }

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
