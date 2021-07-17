/**
 * 判断 obj 是否为纯粹的对象类型
 * @param obj
 */
export function isPlainObject(obj: unknown): boolean {
  return (
    obj != null &&
    typeof obj === 'object' &&
    Object.prototype.toString.call(obj) === '[object Object]'
  )
}

export function isFunction(fc: unknown): boolean {
  return typeof fc === 'function'
}

/**
 * 目标是否为Iterator对象
 * @param obj
 * @returns
 */
export function isIterator(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function'
}
