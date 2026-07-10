export function debounce(fn, time) {
  let timer

  return function (this, ...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), time)
  }
}

export function getValue(target: any, key: string) {
  const path = key.split('.')

  while (path.length) {
    const key = path.shift()
    target = target[key]
  }

  return target
}

export function setValue(target: any, key: string, value: unknown) {
  const keys = key.split('.')
  const lastKey = keys.pop()

  if (keys.length) {
    target = getValue(target, keys.join('.'))
  }

  target[lastKey] = value
}
