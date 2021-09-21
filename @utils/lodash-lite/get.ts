/*
 * @description:
 * @author: jiangxtx
 */

function isObjectLike(obj) {
  return typeof obj === 'object' && obj !== null
}

/**
 * 判断`value`是否是`Symbol`类型
 * Checks if `value` is classified as a `Symbol` primitive or Object.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * isSymbol(Symbol(3))
 * // => true
 *
 * isSymbol({[Symbol.toStringTag]: 'Symbol'})
 * // => true
 *
 * isSymbol('abc')
 * // => false
 */

function isSymbol(value) {
  if (typeof value === 'symbol') {
    return true
  }

  return isObjectLike(value) && Object.prototype.toString.call(value) === '[object Symbol]'
}

const INFINITE = 1 / 0

function toKey(value) {
  if (typeof value === 'string' || isSymbol(value)) {
    return value
  }

  const valueStr = `${value}`
  return valueStr === '0' ? (1 / value === INFINITE ? '0' : '-0') : valueStr
}

function isKey(value, object) {
  if (Array.isArray(value)) {
    return false
  }

  /** Used to match property names within property paths. */
  const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
  const reIsPlainProp = /^\w*$/

  const type = typeof value
  if (
    type === 'number' ||
    type === 'symbol' ||
    type === 'boolean' ||
    value == null ||
    isSymbol(value)
  ) {
    return true
  }

  return (
    reIsPlainProp.test(value) ||
    !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
  )
}

/**
 * 把字符串类型的路径转化为数组（每一个元素为一个子路径Item）
 * TODO：可接入memorize优化
 * @param {*} string
 */
function stringToPath(string) {
  /** Used to match property names within property paths. */
  const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g

  /** Used to match backslashes in property paths. */
  const reEscapeChar = /\\(\\)?/g

  const result = []
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('')
  }
  string.replace(rePropName, (match, number, quote, subString) => {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match)
  })
  return result
}

function castPath(value, object) {
  if (Array.isArray(value)) {
    return value
  }

  if (isKey(value, object)) {
    return [value]
  }

  return stringToPath(`${value}`)
}

function baseGet(object, path) {
  path = castPath(path, object)
  const { length } = path
  let index = 0

  while (object != null && index < length) {
    object = object[toKey(path[index++])]
  }

  return index && index === length ? object : undefined
}

/**
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 *
 * @param {*} object
 * @param {*} path
 * @param {*} defaultValue
 * @return {object}
 */
function get(object, path, defaultValue?: unknown): any {
  const result = object == null ? undefined : baseGet(object, path)
  return result === undefined ? defaultValue : result
}

export default get
export { get }
