import { setValue, getValue } from '@/utils'

// 撤销的最大容量
const MAX_HISTORY_LENGTH = 1000

const undoStack = shallowReactive([])
const redoStack = shallowReactive([])

export function useUndoRedo() {
  const canUndo = computed(() => undoStack.length > 0)
  const canRedo = computed(() => redoStack.length > 0)

  let activeBatch = null

  // 设置缓存分支
  function startBatch() {
    activeBatch = []
  }

  // 提交缓存分支
  function commitBatch() {
    if (activeBatch.length) {
      pushRecord(activeBatch)
    }
    activeBatch = null
  }

  // 栈满了则删除最早的记录
  function pushRecord(record) {
    undoStack.push(record)
    if (undoStack.length > MAX_HISTORY_LENGTH) {
      undoStack.shift()
    }
  }

  // 更改属性
  function applyChange(target, key, newValue) {
    const oldValue = getValue(target, key)

    if (oldValue === newValue) return

    const record = {
      target,
      key,
      oldValue,
      newValue,
    }

    if (activeBatch) {
      const _record = activeBatch.find((item) => item.target == target && item.key == key)

      if (_record) {
        // 之前已经改过则直接更新 newValue
        _record.newValue = newValue
      } else {
        // 没改过则新增
        activeBatch.push(record)
      }
    } else {
      pushRecord([record])
    }
    setValue(target, key, newValue)

    redoStack.length = 0
  }

  // 撤销
  function undo() {
    const records = undoStack.pop()

    if (!records) return

    records.toReversed().forEach((record) => {
      const { target, key, oldValue } = record

      setValue(target, key, oldValue)
    })

    redoStack.push(records)
  }

  // 重做
  function redo() {
    const records = redoStack.pop()

    if (!records) return

    records.forEach((record) => {
      const { target, key, newValue } = record

      setValue(target, key, newValue)
    })

    pushRecord(records)
  }

  return {
    canRedo,
    canUndo,
    undo,
    redo,
    applyChange,
    startBatch,
    commitBatch,
  }
}
