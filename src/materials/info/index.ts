import type { Material } from '@/types/index.ts'

export const infoMaterial: Material[] = [
  {
    name: '标题',
    group: 'info',
    icon: 'streamline-color:graph-flat',
  },
  {
    name: '介绍',
    group: 'info',
    icon: 'streamline-color:graph-flat',
  },
]

export function install(callback: (material: Material[]) => void) {
  callback(infoMaterial)
}
