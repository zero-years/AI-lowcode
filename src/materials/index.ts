const material = [
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
  {
    name: '标题',
    group: 'text',
    icon: 'streamline-color:graph-flat',
  },
  {
    name: '介绍',
    group: 'info',
    icon: 'streamline-color:graph-flat',
  },
  {
    name: '表单',
    group: 'form',
    icon: 'streamline-color:graph-flat',
  },
]

const groups = [
  {
    name: '图表',
    icon: 'codicon:graph',
    key: 'charts',
  },
  {
    name: '文本',
    icon: 'mdi:text-box-outline',
    key: 'text',
  },
  {
    name: '信息',
    icon: 'mdi:information-outline',
    key: 'info',
  },
  {
    name: '表单',
    icon: 'ant-design:form-outlined',
    key: 'form',
  },
]

export function getMaterialByGroup(group: string) {
  return material.filter((item) => item.group === group)
}

export function getGroups() {
  return groups
}
