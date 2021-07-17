/*
 * @description: 调用函数取值的缓存化处理。
   Note：目前仅依赖于函数的第一个传参作为缓存的key值。

 * @author: jiangxtx
 */
import isClient from '@utils/isClient';

const MAX_MEMOIZE_SIZE = 500
let cache = {}

function memoize(func) {
  if (typeof func !== 'function') {
    throw new Error('param shoud be a function')
  }

  // @ts-ignore
  if (!isClient) {
    // disabled-line
    console.warn('memoize()已被应用在SSR中，可能存在缓存同构失效！')
  }

  return function memoized(...args) {
    // Note: 我们这里就取第一个参数作为key，lodash中则是用所有的参数生成key. TODO:
    const key = args[0]
    // console.log('cache:: ', cache);

    if (cache[key]) {
      return cache[key]
    }

    // 这里要注意执行时的context问题
    const result = func.apply(this, args)

    // 缓存数量溢出时 清空所有cache
    const cacheKeys = Object.keys(cache) || []
    if (cacheKeys.length > MAX_MEMOIZE_SIZE) {
      cache = {}
    }

    cache[key] = result

    return result
  }
}

export default memoize
