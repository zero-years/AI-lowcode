<script setup lang="ts">
import type { MaterialSchema } from '@/schema/material'
import { init, type EChartsType } from 'echarts'
import { useDataSource } from '@/composables/useDataSource'

defineOptions({
  name: 'ChartComponent',
})

/**
 * 物料来源
 * 1. 编辑时的状态 => 使用画布绘制时
 * 2. 渲染时的状态 => 已经发布的页面或预览页面
 */

const chartRef = useTemplateRef('chartRef')

const dataId = computed(() => props.schema.dataId)

const props = defineProps<{ schema: MaterialSchema }>()

const { data, loading } = useDataSource(dataId)

const option = computed(() => {
  const _option = props.schema.props.option
  return {
    ..._option,
    dataset: {
      ...option.dataset,
      // 重写 source 找不到则用回原始数据
      source: data.value || _option.dataset.source,
    },
  }
})

let chart: EChartsType

watch(
  option,
  (newValue) => {
    chart.setOption(newValue)
  },
  { deep: true },
)

onMounted(() => {
  chart = init(chartRef.value)
  chart.setOption(props.schema.props.option)

  const observer = new ResizeObserver(() => {
    chart.resize()
  })

  observer.observe(chartRef.value)

  onBeforeUnmount(() => {
    observer.disconnect()
    chart.dispose()
  })
})
</script>

<template>
  <div v-loading="loading" class="chart_material w-full h-full" ref="chartRef"></div>
</template>

<style scoped lang=""></style>
