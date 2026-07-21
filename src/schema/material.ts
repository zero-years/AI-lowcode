interface MaterialLayout {
  x: number
  y: number
  width: number
  height: number
}

export interface MaterialEvent {
  // 事件类型 click mouseMove
  type: string
  // 事件标题
  title: string
  // 函数名称
  name: string
  /** 函数体
   *  const fn = new Function(args, console.log(args))
   *  fn(123) => 123
   */
  code: string
  // 根据 code 生产的函数
  handler?: (...args: any[]) => any
}

export interface MaterialSchema {
  type: string
  name: string
  id: string
  locked?: boolean
  layout: MaterialLayout
  style?: Record<string, any>
  props: Record<string, any>
  dataId?: string
  event?: MaterialEvent[]
}

interface MaterialSetter {
  type: string
  label: string
  key: string
  [key: string]: any
}

export interface Material {
  name: string
  group: string
  icon: string
  schema: Omit<MaterialSchema, 'id'>
  setters: MaterialSetter[]
}

export interface MaterialGroup {
  name: string
  icon: string
  key: string
}
