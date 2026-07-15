import Mock from 'mockjs'

Mock.mock(/\/api\/data/, 'get', (options) => {
  // 创建 URL
  const url = new URL(options.url, location.origin)

  // 获取 URL 中的参数对象
  const search = new URLSearchParams(url.search)
  const date = search.get('date')

  const data = Mock.mock({
    'list|8': [
      {
        'label|+1': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月'],
        'value|100-1000': 0,
        date,
      },
    ],
  })

  return data.list
})
