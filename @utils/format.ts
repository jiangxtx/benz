import { camel2Underline } from './string'

export function tryDo(fc, defaultVal = null): any {
  try {
    const value = fc && fc()
    return value == null ? defaultVal : value
  } catch (_) {
    return defaultVal
  }
}

export default tryDo

/**
 * 把对象中value为null强制转为underlined。
 *
 * Note：这么做通常有以下几个应用场景：
 *      + ES6解构时，统一转为undefined 可方便逻辑解构；
 *      + form传参时，可自动过滤掉undefined的key-val；
 * @param {*} obj
 */
export function forceNilVal2Undefined(obj): any {
  if (obj === null) return undefined

  if (Array.isArray(obj)) {
    return obj.map((item) => forceNilVal2Undefined(item))
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj) || []

    return keys.reduce((prev, curr) => {
      // eslint-disable-next-line no-param-reassign
      prev[curr] = forceNilVal2Undefined(obj[curr])
      return prev
    }, {})
  }

  return obj
}

/**
 * 避免null的干扰，返回一个可安全解构的对象。
 * @param {*} obj
 */
export function safeDeconstructWrap(obj): any {
  const defaultValue = Array.isArray(obj) ? [] : {}
  return forceNilVal2Undefined(obj || defaultValue)
}

/**
 * 把目标对象中所有的驼峰式的key转化为下划线式的key。
 * Note：通常用于http请求中，对后端返回的rawData做第一层处理，这样做的优点：
 *    + 业务代码中可统一以驼峰式规范命名、Coding
 *    + 转化为undefined后，可方便统一ES6的解构
 *
 * @param obj {any} 待转化对象
 * @param isNil2Undefined {Boolean} 是否需要把null值转化为undefined，默认为：true，具体说明参考：forceNilVal2Undefined()
 */
export function formatCamelKeys2Underline(obj: any, isNil2Undefined?: boolean): any {
  isNil2Undefined = typeof isNil2Undefined === 'boolean' ? isNil2Undefined : true

  if (obj === null) {
    return isNil2Undefined ? undefined : obj
  }

  if (typeof obj === 'string') {
    return camel2Underline(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => formatCamelKeys2Underline(item, isNil2Undefined))
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((prev, cur) => {
      const key = camel2Underline(cur)
      const val = obj[cur]
      prev[key] =
        val == null
          ? isNil2Undefined
            ? undefined
            : val
          : formatCamelKeys2Underline(val, isNil2Undefined)

      return prev
    }, {})
  }

  return obj
}
