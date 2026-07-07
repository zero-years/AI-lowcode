import type { Material } from '../types.ts'

export const chartsMaterial: Material[] = [
  {
    name: '柱状图',
    icon: 'streamline-color:graph-flat',
    group: 'charts',
    schema: {
      type: 'charts',
      name: '柱状图',
      layout: {
        x: 0,
        y: 0,
        width: 300,
        height: 200,
      },
      props: {
        options: {},
      },
    },
  },
  {
    name: '条形图',
    group: 'charts',
    icon: 'streamline-color:graph-flat',
    schema: {
      type: 'charts',
      name: '柱状图',
      layout: {
        x: 0,
        y: 0,
        width: 300,
        height: 200,
      },
      props: {
        options: {},
      },
    },
  },
]

export function install(callback: (material: Material[]) => void) {
  callback(chartsMaterial)
}
