import type { Component } from 'vue'
import type { Material, MaterialGroup, MaterialSchema } from '@/schema/material.ts'

const materials: Material[] = []

const componentMap = new Map()
const materialMap = new Map()

const materialModules = import.meta.glob('./*/index.ts', { eager: true })

Object.values(materialModules).forEach((module) => {
  //@ts-ignore
  module.install(registerMaterial)
})

const groups: MaterialGroup[] = [
  {
    name: '图表',
    icon: 'codicon:graph',
    key: 'charts',
  },
  {
    name: '信息',
    icon: 'mdi:information-outline',
    key: 'info',
  },
]

export function registerMaterial(material: Material, component: Component) {
  materials.push(material)
  componentMap.set(material.schema.type, component)
  materialMap.set(material.schema.type, material)
}

export function getMaterialByGroup(group: string) {
  return materials.filter((item) => item.group === group)
}

export function getMaterialGroups() {
  return groups
}

export function getMaterialComponent(type: string) {
  return componentMap.get(type)
}

export function getMaterialSetters(type: string) {
  return materialMap.get(type)?.setters || []
}

export function getMaterialEventOptions(type: string) {
  return materialMap.get(type)?.eventOptions || []
}

export function createNode(node: MaterialSchema) {
  return {
    ...node,
    id: crypto.randomUUID(),
  }
}
