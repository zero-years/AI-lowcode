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

  // 当 type 为 api 时，url 为接口地址
  url?: string

  // 当 type 为 api 时，responsePath 为接口返回数据的路径
  responsePath?: string

  // 请求方法
  method?: 'get' | 'post'

  // 轮询时间，有则开启
  interval?: number

  // 预设的接口参数
  params?: Record<string, any>
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
