import type { MaterialSchema } from '@/materials/types'
import { defineStore } from 'pinia'

export const UseEditorStore = defineStore('editor', () => {
  const panelVisible = reactive({
    material: true,
    layer: true,
    property: true,
  })

  // 画布渲染的组件列表
  const nodes = ref<MaterialSchema[]>([])

  // 选中修改的ID
  const selectedNodeId = ref('')

  // 选中修改的节点
  const selectedNode = computed<MaterialSchema>(() => {
    return nodes.value.find((node) => node.id == selectedNodeId.value)
  })

  function togglePanel(panelName: 'material' | 'layer' | 'property') {
    panelVisible[panelName] = !panelVisible[panelName]
  }

  function addNode(node: MaterialSchema) {
    nodes.value.push(node)
  }

  function selectNode(id: string) {
    selectedNodeId.value = id
  }

  function clearSelected() {
    selectedNodeId.value = null
  }

  return {
    panelVisible,
    nodes,
    selectedNodeId,
    selectedNode,
    togglePanel,
    addNode,
    selectNode,
    clearSelected,
  }
})
