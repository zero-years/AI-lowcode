export function debounce(fn, time) {
  let timer

  return function (this, ...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), time)
  }
}

export function getValue(target: any, key: string) {
  if (!key) return target

  const path = key.split('.')

  while (path.length) {
    const key = path.shift()
    target = target[key]
  }

  return target
}

export function setValue(target: any, key: string, value: any) {
  const keys = key.split('.')
  const lastKey = keys.pop()

  if (keys.length) {
    target = getValue(target, keys.join('.'))
  }

  target[lastKey] = value
}

export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  return JSON.parse(JSON.stringify(value))
}
