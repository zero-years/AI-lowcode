import type { Material } from '../types.ts'

export const infoMaterial: Material[] = [
  {
    name: '标题',
    group: 'info',
    icon: 'streamline-color:graph-flat',
    schema: {
      type: 'text',
      name: '标题',
      layout: {
        x: 0,
        y: 0,
        width: 200,
        height: 50,
      },
      style: {
        color: '#000000',
      },
      props: {
        content: '你好',
      },
    },
  },
  {
    name: '介绍',
    group: 'info',
    icon: 'streamline-color:graph-flat',
    schema: {
      type: 'text',
      name: '介绍',
      layout: {
        x: 0,
        y: 0,
        width: 200,
        height: 50,
      },
      style: {
        color: '#000000',
      },
      props: {
        content: '你好呢',
      },
    },
  },
]

export function install(callback: (material: Material[]) => void) {
  callback(infoMaterial)
}
