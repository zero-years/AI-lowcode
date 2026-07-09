import type { Component } from 'vue'
import type { Material } from '@/schema/material.ts'
import TextMaterial from './component.vue'

export const chartsMaterial: Material = {
  name: '柱状图',
  icon: 'streamline-color:graph-flat',
  group: 'charts',
  schema: {
    type: 'charts',
    name: '柱状图',
    locked: false,
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
}

export function install(callback: (material: Material, component: Component) => void) {
  callback(chartsMaterial, TextMaterial)
}
