import type { MaterialSchema } from '@/schema/material.ts'

export interface SourceSchema {
  /**
   * 数据源类型
   * api => 接口返回
   * static => 静态数据
   */
  type: 'api' | 'static'

  // 唯一 ID
  id: string

  // 数据源名称
  name: string

  // 数据载体
  data: any
}

interface CanvasSchema {
  width: number
  height: number
  backgroundColor: string
}

export interface PageSchema {
  canvas: CanvasSchema
  dataSources: SourceSchema[]
  nodes: MaterialSchema[]
}
