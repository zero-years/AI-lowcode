import type { OnDrag, OnDragGroup, OnResize, OnResizeGroup } from 'vue3-moveable'
import { UseEditorStore } from '@/stores/editor'
import { useUndoRedo } from '@/composables/useUndoRedo'

export function useMoveable(moveableRef) {
  const editorStore = UseEditorStore()
  const { applyChange, startBatch, commitBatch } = useUndoRedo()

  watch(
    () =>
      editorStore.nodes.map((node) => {
        return node.layout
      }),
    () => {
      moveableRef.value.updateRect(undefined, true)
    },
    {
      flush: 'post',
    },
  )

  function onStart() {
    startBatch()
  }

  function onEnd() {
    commitBatch()
  }

  function onDrag(e: OnDrag) {
    e.target.style.left = e.left + 'px'
    e.target.style.top = e.top + 'px'

    const node = getNodeByTarget(e.target as HTMLElement)

    applyChange(node, 'layout', { ...node.layout, x: e.left, y: e.top })
  }

  function onDragGroup(e: OnDragGroup) {
    e.events.forEach(onDrag)
  }

  function onResize(e: OnResize) {
    e.target.style.width = e.width + 'px'
    e.target.style.height = e.height + 'px'
    const node = getNodeByTarget(e.target as HTMLElement)
    applyChange(node, 'layout', { ...node.layout, width: e.width, height: e.height })

    onDrag(e.drag)
  }

  function onResizeGroup(e: OnResizeGroup) {
    e.events.forEach(onResize)
  }

  function getNodeByTarget(target: HTMLElement) {
    const nodeId = target.getAttribute('data-node-id')
    return editorStore.findNodeById(nodeId)
  }

  return {
    onDrag,
    onDragGroup,
    onResize,
    onResizeGroup,
    onStart,
    onEnd,
  }
}
