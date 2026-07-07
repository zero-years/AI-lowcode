export function debounce(fn, time) {
  let timer

  return function (this, ...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), time)
  }
}
