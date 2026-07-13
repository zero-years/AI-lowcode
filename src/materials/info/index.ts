import type { Component } from 'vue'
import type { Material } from '@/schema/material.ts'
import InfoComponent from './component.vue'

export const infoMaterial: Material = {
  name: '标题',
  group: 'info',
  icon: 'streamline-color:graph-flat',
  setters: [
    {
      type: 'input',
      label: '内容',
      key: 'props.content',
    },
    {
      type: 'color',
      label: '颜色',
      key: 'style.color',
    },
  ],
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
      color: '#fff',
    },
    props: {
      content: '你好',
    },
  },
}

export function install(callback: (material: Material, component: Component) => void) {
  callback(infoMaterial, InfoComponent)
}
