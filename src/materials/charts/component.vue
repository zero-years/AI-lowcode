<script setup lang="ts">
import type { MaterialSchema } from '@/schema/material'
import { init, type EChartsType } from 'echarts'

defineOptions({
  name: 'ChartComponent',
})

const chartRef = useTemplateRef('chartRef')

const props = defineProps<{ schema: MaterialSchema }>()

let chart: EChartsType

watch(
  () => props.schema.props.option,
  () => {
    chart.setOption(props.schema.props.option)
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
  <div class="chart_material w-full h-full" ref="chartRef">渲染图标</div>
</template>

<style scoped lang=""></style>
