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
