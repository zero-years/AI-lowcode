export function debounce(fn, time) {
  let timer

  return function (this, ...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), time)
  }
}

export function getDeepValue(target: any, key: string) {
  const path = key.split('.')

  while (path.length) {
    const key = path.shift()
    target = target[key]
  }

  return target
}

export function setDeepValue(target: any, key: string, value: unknown) {
  const path = key.split('.')
  const lastKey = path.pop()
  const _target = getDeepValue(target, path.join('.'))

  _target[lastKey] = value
}
