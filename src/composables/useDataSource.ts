import type { SourceSchema } from '@/schema/page'
import axios from 'axios'

export function useDataSource(dataId: Ref<string>) {
  const dataSources = inject<Ref<SourceSchema[]>>('dataSources')
  let timer

  const source = computed(() => {
    return dataSources.value.find((data) => data.id === dataId.value)
  })

  const data = ref()

  async function loadData() {
    if (!source.value) return
    if (source.value.type === 'api') {
      const url = source.value.url

      try {
        // 获取当前 URL 参数
        const search = new URLSearchParams(location.search)

        // 将参数转为 params 对象
        const params = Object.fromEntries(search.entries())

        console.log('params ==>', params)

        const res = await axios.get(url, {
          params: {
            ...source.value.params,
            ...params,
          },
        })
        data.value = res.data
      } finally {
        if (source.value.interval) {
          timer = setTimeout(() => {
            loadData()
          }, source.value.interval)
        }
      }
    } else {
      data.value = source.value.data
    }
  }

  watch(source, loadData, { immediate: true })

  // 组件销毁前清理定时器
  onBeforeUnmount(() => {
    clearTimeout(timer)
  })

  return {
    source,
    data,
  }
}
