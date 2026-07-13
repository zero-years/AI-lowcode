import type { SourceSchema } from '@/schema/page'

export function useDataSource(dataId: Ref<string>) {
  const dataSources = inject<Ref<SourceSchema[]>>('dataSources')

  const source = computed(() => {
    return dataSources.value.find((data) => data.id === dataId.value)
  })

  const data = computed(() => source.value?.data)

  return {
    source,
    data,
  }
}
