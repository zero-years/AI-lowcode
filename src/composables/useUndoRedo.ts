import { setValue, getValue } from '@/utils'

const undoStack = shallowReactive([])
const redoStack = shallowReactive([])

export function useUndoRedo() {
  const canUndo = computed(() => undoStack.length > 0)
  const canRedo = computed(() => redoStack.length > 0)

  function applyChange(target, key, newValue) {
    const oldValue = getValue(target, key)

    if (oldValue === newValue) return

    const record = {
      target,
      key,
      oldValue,
      newValue,
    }

    undoStack.push(record)

    setValue(target, key, newValue)

    redoStack.length = 0
  }

  // 撤销
  function undo() {
    const record = undoStack.pop()

    if (!record) return

    const { target, key, oldValue } = record

    setValue(target, key, oldValue)

    redoStack.push(record)
  }

  // 重做
  function redo() {
    const record = redoStack.pop()

    if (!record) return

    const { target, key, newValue } = record

    setValue(target, key, newValue)

    undoStack.push(record)
  }

  return {
    canRedo,
    canUndo,
    undo,
    redo,
    applyChange,
  }
}
