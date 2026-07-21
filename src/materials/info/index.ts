import type { Component } from 'vue'
import type { Material } from '@/schema/material.ts'
import InfoComponent from './component.vue'

export const infoMaterial: Material = {
  name: '标题',
  group: 'info',
  icon: 'fluent-color:content-view-32',
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
    {
      type: 'number',
      label: '字号',
      key: 'style.fontSize',
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
      fontSize: 16,
    },
    props: {
      content: '你好',
    },
    event: [
      {
        type: 'click',
        name: 'fn',
        code: '',
        title: '点击事件',
      },
    ],
  },
}

export function install(callback: (material: Material, component: Component) => void) {
  callback(infoMaterial, InfoComponent)
}
