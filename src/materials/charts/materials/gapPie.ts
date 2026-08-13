import type { Material } from '@/schema/material.ts'

export const gapPieMaterial: Material = {
  name: '间隙饼图',
  group: 'charts',
  icon: 'fluent-color:data-pie-32',
  setters: [
    {
      type: 'input',
      label: '标题',
      key: 'props.option.title.text',
    },
    {
      type: 'multColor',
      label: '颜色',
      key: 'props.option.color',
    },
    {
      type: 'number',
      label: '间隙大小',
      key: 'props.option.series.0.padAngle',
    },
  ],
  schema: {
    type: 'gap-pie-chart',
    name: '饼图',
    layout: {
      x: 0,
      y: 0,
      width: 400,
      height: 260,
    },
    props: {
      option: {
        color: ['#22d3ee', '#a78bfa', '#f59e0b', '#34d399'],
        title: {
          text: '访问来源占比',
          top: 8,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
        },
        legend: {
          top: 38,
          left: 'center',
          itemWidth: 12,
          itemHeight: 8,
          show: true,
          textStyle: {
            color: '#cbd5e1',
          },
        },
        dataset: {
          source: [
            { label: '搜索引擎', value: 1048 },
            { label: '直接访问', value: 735 },
            { label: '联盟广告', value: 484 },
            { label: '视频广告', value: 300 },
          ],
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            center: ['50%', '62%'],
            radius: ['20%', '50%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10,
            },
            label: {
              color: '#e2e8f0',
            },
            labelLine: {
              show: false,
            },
            encode: {
              itemName: 'label',
              value: 'value',
            },
          },
        ],
      },
    },
  },
}
