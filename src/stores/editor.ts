import { defineStore } from 'pinia'

export const UseEditorStore = defineStore('editor', () => {
  const panelVisible = reactive({
    material: true,
    layer: true,
    property: true,
  })

  const togglePanel = (panelName: 'material' | 'layer' | 'property') => {
    panelVisible[panelName] = !panelVisible[panelName]
  }

  return {
    panelVisible,
    togglePanel,
  }
})
