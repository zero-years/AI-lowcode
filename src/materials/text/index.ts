import type { Material } from '@/types/index.ts'

export const textMaterial: Material[] = [
  {
    name: '标题',
    group: 'text',
    icon: 'streamline-color:graph-flat',
  },
  {
    name: '介绍',
    group: 'text',
    icon: 'streamline-color:graph-flat',
  },
]

export function install(callback: (material: Material[]) => void) {
  callback(textMaterial)
}
