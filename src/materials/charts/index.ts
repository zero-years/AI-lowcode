import type { Component } from 'vue'
import type { Material } from '@/schema/material.ts'
import ChartComponent from './component.vue'
import { barMaterial } from './materials/bar.ts'
import { areaMaterial } from './materials/area.ts'
import { lineMaterial } from './materials/line.ts'
import { pieMaterial } from './materials/pie.ts'

const chartsMaterial = [barMaterial, areaMaterial, lineMaterial, pieMaterial]

export function install(callback: (material: Material, component: Component) => void) {
  chartsMaterial.forEach((material) => {
    callback(material, ChartComponent)
  })
}
