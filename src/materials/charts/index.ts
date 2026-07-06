import type { Material } from '@/types/index.ts'

export const chartsMaterial: Material[] = [
  {
    name: '柱状图',
    icon: 'streamline-color:graph-flat',
    group: 'charts',
  },
  {
    name: '条形图',
    group: 'charts',
    icon: 'streamline-color:graph-flat',
  },
]

export function install(callback: (material: Material[]) => void) {
  callback(chartsMaterial)
}
