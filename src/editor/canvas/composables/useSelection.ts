import type { MaterialSchema } from '@/schema/material'
import { UseEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

export function useSelection({ moveableRef, stageRef }) {
  const editorStore = UseEditorStore()

  const { selectedNodeIds } = storeToRefs(editorStore)

  // 选中修改的元素
  const selectedTarget = shallowRef<HTMLElement[]>()

  watch(
    selectedNodeIds,
    (ids) => {
      selectedTarget.value = ids.map((id) =>
        stageRef.value.querySelector(`[data-node-id='${id}']:not([data-node-locked='true'])`),
      )
    },
    { deep: true, flush: 'post' },
  )

  function onSelect(node: MaterialSchema, e: MouseEvent) {
    editorStore.selectNode(node.id)

    nextTick(() => {
      moveableRef.value.dragStart(e)
    })
  }

  function onClearSelect() {
    editorStore.clearSelected()
  }

  function onSelectEnd(e) {
    const ids = e.selected.map((element) => element.getAttribute('data-node-id'))
    editorStore.selectNodes(ids)
  }

  return {
    onSelect,
    onClearSelect,
    onSelectEnd,
    selectedTarget,
  }
}
