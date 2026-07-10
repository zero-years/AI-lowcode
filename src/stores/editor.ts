import type { MaterialSchema } from '@/schema/material.ts'
import type { PageSchema } from '@/schema/page.ts'
import { defineStore } from 'pinia'
import { useUndoRedo } from '@/composables/useUndoRedo'

export const UseEditorStore = defineStore('editor', () => {
  const { applyChange } = useUndoRedo()

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

  function setNodes(newNodes: MaterialSchema[]) {
    applyChange(nodes, 'value', newNodes)
  }

  // 拖拽进画布
  function addNode(node: MaterialSchema) {
    setNodes([...nodes.value, node])
  }

  // 单选
  function selectNode(id: string) {
    selectedNodeIds.value = [id]
  }

  // 框选
  function selectNodes(ids: string[]) {
    selectedNodeIds.value = ids
  }

  // 清空选中
  function clearSelected() {
    selectedNodeIds.value = []
  }

  function findNodeById(id: string) {
    return nodes.value.find((node) => node.id == id)
  }

  // 复制节点
  function copyNode(node: MaterialSchema) {
    const newNode = JSON.parse(JSON.stringify(node))
    newNode.layout.x += 20
    newNode.layout.y += 20
    newNode.id = crypto.randomUUID()
    addNode(newNode)
    selectNode(newNode.id)
  }

  // 删除节点
  function removeNode(node: MaterialSchema) {
    setNodes(nodes.value.filter((item) => item.id !== node.id))
    selectedNodeIds.value = selectedNodeIds.value.filter((id) => id !== node.id)
  }

  function moveTop(node: MaterialSchema) {
    const index = nodes.value.findIndex((item) => item.id === node.id)
    const splicedNodes = nodes.value.toSpliced(index, 1)
    setNodes([node, ...splicedNodes])
  }

  function moveBottom(node: MaterialSchema) {
    const index = nodes.value.findIndex((item) => item.id === node.id)
    const splicedNodes = nodes.value.toSpliced(index, 1)
    setNodes([...splicedNodes, node])
  }

  function toggleLock(node: MaterialSchema) {
    applyChange(node, 'locked', !node.locked)
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
    copyNode,
    removeNode,
    moveTop,
    moveBottom,
    toggleLock,
  }
})
