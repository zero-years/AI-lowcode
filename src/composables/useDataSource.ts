import type { SourceSchema } from '@/schema/page'
import axios from 'axios'
import { getValue } from '@/utils'

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
      try {
        const res = await fetchData(source.value)

        data.value = res
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

export async function fetchData(source: SourceSchema) {
  const search = new URLSearchParams(location.search)

  // 将参数转为 params 对象
  const params = Object.fromEntries(search.entries())

  const queryParams = {
    ...source.params,
    ...params,
  }

  const paramsKey = source.method === 'post' ? 'data' : 'params'

  const res = await axios.request({
    url: source.url,
    method: source.method || 'get',
    [paramsKey]: queryParams,
  })

  return getValue(res.data, source.responsePath)
}
