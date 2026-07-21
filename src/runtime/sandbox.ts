const globalKeys = new Set(['console', 'Promise', 'setTimeout'])

/**
 * 在沙箱中运行代码
 * @param code 需要执行的代码
 * @param scope 沙箱读取的作用域
 */
export function runSandbox(code: string, scope: Record<string, any>) {
  const sandBox = new Proxy(scope, {
    has() {
      return true
    },
    get(target, key) {
      if (key === Symbol.unscopables) return
      if (Object.hasOwn(target, key)) {
        // 访问 Scope 中的 key
        return target[key as string]
      }
      if (globalKeys.has(key as string)) {
        // 确保 this 不丢失
        const value = globalThis[key]
        return typeof value === 'function' ? value.bind(globalThis) : value
      }
    },
  })

  const fn = new Function(
    'sandbox',
    `
      const asyncFn = async () => {
        with(sandbox){
          ${code}
        }
      }
      asyncFn()
    `,
  )

  fn(sandBox)
}
