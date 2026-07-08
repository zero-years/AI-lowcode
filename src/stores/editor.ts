import type { MaterialSchema } from '@/schema/material.ts'
import type { PageSchema } from '@/schema/page.ts'
import { defineStore } from 'pinia'

export const UseEditorStore = defineStore('editor', () => {
  const panelVisible = reactive({
    material: true,
    layer: true,
    property: true,
  })

  const page = ref<PageSchema>({
    canvas: {
      width: 1920,
      height: 1080,
      backgroundColor: '#181A1E',
    },
    nodes: [],
  })

  const canvas = toRef(page.value, 'canvas')

  // 画布渲染的组件列表
  const nodes = toRef(page.value, 'nodes')

  // 框选的 ID 列表
  const selectedNodeIds = ref<string[]>([])

  // 选中修改的ID
  // 从多选 ids 中计算出，如果只有一个选中，则返回该 id，否则返回 null
  const selectedNodeId = computed(() => {
    return selectedNodeIds.value.length == 1 ? selectedNodeIds.value[0] : null
  })

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

  // 单选
  function selectNode(id: string) {
    selectedNodeIds.value = [id]
  }

  function selectNodes(ids: string[]) {
    selectedNodeIds.value = ids
  }

  function clearSelected() {
    selectedNodeIds.value = []
  }

  function findNodeById(id: string) {
    return nodes.value.find((node) => node.id == id)
  }

  return {
    panelVisible,
    nodes,
    selectedNodeId,
    selectedNode,
    selectedNodeIds,
    canvas,
    page,
    togglePanel,
    addNode,
    selectNode,
    clearSelected,
    selectNodes,
    findNodeById,
  }
})
