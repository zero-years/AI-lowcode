import type { PageSchema } from '@/schema/page'

const SCREEN_PUBLISH = 'screen_publish'

export function publishPage(page: PageSchema) {
  let value: string | Record<string, PageSchema> = localStorage.getItem(SCREEN_PUBLISH)

  if (value) {
    value = JSON.parse(value)
  } else {
    value = {}
  }

  // 查看当前的 page 是否已经有 id 没有则创建新的
  const id = page.id || crypto.randomUUID()
  value[id] = page
  page.id = id

  localStorage.setItem(SCREEN_PUBLISH, JSON.stringify(value))

  return id
}

export function getPublishPage(id: string) {
  const value = localStorage.getItem(SCREEN_PUBLISH)
  const map = JSON.parse(value)
  const page = map[id]
  if (!page) {
    throw Error(`数据库中不存在 ID 为 ${id} 的数据`)
  }

  return page
}
