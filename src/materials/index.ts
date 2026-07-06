import type { Material, MaterialGroup } from '@/types/index.ts'

const materials: Material[] = []

const groups: MaterialGroup[] = [
  {
    name: '图表',
    icon: 'codicon:graph',
    key: 'charts',
  },
  {
    name: '信息',
    icon: 'mdi:information-outline',
    key: 'text',
  },
]

const materialModules = import.meta.glob('./*/index.ts', { eager: true })

Object.values(materialModules).forEach((module) => {
  module.install(registerMaterial)
})

export function registerMaterial(material: Material[]) {
  materials.push(...material)
}

export function getMaterialByGroup(group: string) {
  return materials.filter((item) => item.group === group)
}

export function getGroups() {
  return groups
}
