interface MaterialLayout {
  x: number
  y: number
  width: number
  height: number
}

export interface MaterialSchema {
  type: string
  name: string
  id: string
  layout: MaterialLayout
  style?: Record<string, any>
  props: Record<string, any>
}

export interface Material {
  name: string
  group: string
  icon: string
  schema: Omit<MaterialSchema, 'id'>
}

export interface MaterialGroup {
  name: string
  icon: string
  key: string
}
