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
  const loading = ref(false)
  const error = ref()

  async function loadData(params?: Record<string, any>) {
    clearTimeout(timer)

    if (!source.value) return
    if (source.value.type === 'api') {
      try {
        loading.value = true

        const res = await fetchData(source.value, params)

        data.value = res
      } catch (err) {
        error.value = err
      } finally {
        loading.value = false
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

  watch(
    source,
    () => {
      loadData()
    },
    { immediate: true },
  )

  // 组件销毁前清理定时器
  onBeforeUnmount(() => {
    clearTimeout(timer)
  })

  return {
    data,
    loading,
    error,
    refresh: loadData,
  }
}

/**
 * 请求缓存复用，相同的 url + params + method 直接读取缓存，避免重复请求
 */
const requestMap = {}

export async function fetchData(source: SourceSchema, data?: Record<string, any>) {
  const search = new URLSearchParams(location.search)

  // 将参数转为 params 对象
  const params = Object.fromEntries(search.entries())

  const queryParams = {
    // 默认请求参数
    ...source.params,
    // url 参数
    ...params,
    // 手动添加的参数,优先级最高
    ...data,
  }

  const paramsKey = source.method === 'post' ? 'data' : 'params'

  const config = {
    url: source.url,
    method: source.method || 'get',
    [paramsKey]: queryParams,
  }

  const cacheKey = JSON.stringify(config)

  if (requestMap[cacheKey]) {
    // 已经请求过，直接返回缓存的 promise ，避免重复请求

    return requestMap[cacheKey]
  }

  const promise = axios
    .request(config)
    .then((res) => {
      getValue(res.data, source.responsePath)
    })
    .finally(() => {
      // 请求结束删除缓存
      delete requestMap[cacheKey]
    })

  requestMap[cacheKey] = promise

  return promise
}
