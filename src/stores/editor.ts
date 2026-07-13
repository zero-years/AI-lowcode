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
    dataSources: [
      {
        type: 'static',
        id: '123',
        name: '销售数据',
        data: [
          { label: '1月', value: 100 },
          { label: '2月', value: 200 },
          { label: '3月', value: 300 },
          { label: '4月', value: 400 },
        ],
      },
      {
        type: 'static',
        id: '321',
        name: '访问',
        data: [
          { label: '1月', value: 1000 },
          { label: '2月', value: 2000 },
          { label: '3月', value: 3000 },
          { label: '4月', value: 4000 },
        ],
      },
    ],
  })

  const canvas = toRef(page.value, 'canvas')

  // 画布渲染的组件列表
  const nodes = toRef(page.value, 'nodes')

  const dataSources = toRef(page.value, 'dataSources')

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

  function setPage(newPage: PageSchema) {
    Object.assign(page.value, newPage)
  }

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

  // 更新节点，由于 selectedNode 是计算属性，不能直接修改，所以需要通过这个方法来更新节点
  function updateNode(id: string, newNode: MaterialSchema) {
    // 更新修改的节点，然后返回一个新的数组，然后替换 Nodes
    const newnodes = nodes.value.map((node) => (node.id == id ? newNode : node))
    setNodes(newnodes)
  }

  return {
    dataSources,
    panelVisible,
    nodes,
    selectedNodeId,
    selectedNode,
    selectedNodeIds,
    canvas,
    page,
    setPage,
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
    updateNode,
  }
})
