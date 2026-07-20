import type { MaterialSchema } from '@/schema/material'
import type { PageSchema } from '@/schema/page'
import { setValue } from '@/utils'

interface RuntimeContext {
  // 获取节点
  getNode(id: string): MaterialSchema | undefined
  /**
   * 修改节点属性
   * @param id
   * @param key
   * @param value
   * setAttribute('111', 'props.content', '你好')
   */
  setAttribute(id: string, key: string, value: any): void
  /**
   * 修改节点的 props
   * @param id
   * @param key
   * @param value
   * setProps('111', 'content', '你好')
   */
  setProps(id: string, key: string, value: any): void
  // 修改节点样式
  setStyle(id: string, key: string, value: any): void
  // 组册组件实例，用于组件间方法的调用
  registerNodeInstance(instances: Record<string, any>): void
  /**
   * 调用 ID 实例上的 name 方法
   * @param id
   * @param name
   */
  trigger(id: string, name: string, ...args: any[]): any
  /**
   * 通过 dataId 刷新数据源，从而改变所有使用到该数据源的表格
   */
  refreshNodesByDataId(dataId: string, ...args: any[]): void
}

export function createRuntimeContext(page: Ref<PageSchema>): RuntimeContext {
  let instanceMap = {}

  const getNode: RuntimeContext['getNode'] = (id) => {
    return page.value.nodes.find((node) => node.id == id)
  }

  const setAttribute: RuntimeContext['setAttribute'] = (id, key, value) => {
    const node = getNode(id)

    if (!node) {
      console.warn(`找不到 ID 为 ${id} 的节点`)
      return
    }

    setValue(node, key, value)
  }

  const setProps: RuntimeContext['setProps'] = (id, key, value) => {
    setAttribute(id, `props.${key}`, value)
  }

  const setStyle: RuntimeContext['setStyle'] = (id, key, value) => {
    setAttribute(id, `style.${key}`, value)
  }

  const registerNodeInstance: RuntimeContext['registerNodeInstance'] = (instances) => {
    instanceMap = instances
  }

  const trigger: RuntimeContext['trigger'] = (id, name, ...args) => {
    const instance = instanceMap[id]

    if (!instance) {
      console.warn(`找不到 ID 为 ${id} 的实例`)
      return
    }

    const fn = instance[name]

    if (!fn) {
      console.warn(`ID 为 ${id} 的实例上不存在该方法`)
      return
    }

    // 调用组件的方法后需要将返回值一并返回
    // instance => return 123
    // trigger => return 123
    return fn(...args)
  }

  const refreshNodesByDataId: RuntimeContext['refreshNodesByDataId'] = (dataId, ...args) => {
    const nodes = page.value.nodes.filter((node) => node.dataId == dataId)

    nodes.forEach((node) => {
      trigger(node.id, 'refresh', ...args)
    })
  }

  return {
    getNode,
    setAttribute,
    setProps,
    setStyle,
    registerNodeInstance,
    trigger,
    refreshNodesByDataId,
  }
}
