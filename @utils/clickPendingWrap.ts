/**
 * 在响应用户的点击操作中，通常需考虑以下两个因素：
 * 1. 防止用户的快速多次点击
 * 2. 当发起http请求时，防止因快速多次点击造成的http连续发送
 *
 * 需要说明的是，上述 1 和 2 是相对独立的存在。即，即便规避了快速多次点击，也不能完全规避http的连续发送。比如，设置允许用户1s点击一次，
 * 但是http请求耗时2s，那么用户点击2次就会发出两个http请求，而实际上，只需发出一次有效的http请求即可。
 *
 * 解决措施：
 * + 针对1，采用throttle节流函数
 * + 针对2，事先约定好http采用Promise化，然后利用Promise的pending状态机制来控制
 *
 * 备忘：
 * 	该文件原名为: clickThrottlePendingWrap，后于2020-11-18更名为: clickPendingWrap.ts。
 *
 * 示例：
 * 	const onItemClick = clickPendingWrap(async () => {
 * 		const data = await store.queryGoodsList(params);
 * 		// deal with data...
 * 	})
 *
 * 	// render UI
 * 	<div onClick={onItemClick}>Item Data</div>
 */

import { showWithoutBg as showSpinnerLoading, hide as hideSpinner } from '@benz/cui-spinner'
import isClient from './isClient'

const isFunc = (fc) => typeof fc === 'function'

const DEFAULT_OPTIONS = {
  showSpinner: true, // 点击后是否展示spinner
  spinnerDelay: 300, // 延时展示spinner的阈值(ms)
  throttleDelay: 1000, // 函数节流的时间间隔(ms)
}

interface Options {
  showSpinner?: boolean
  spinnerDelay?: number
  throttleDelay?: number
}

/**
 * 给用户的点击方法添加节流与Promise-pending操作
 * ext.
 *    const onClick = clickPendingWrap(async (params) => {
 *      const data = await queryGoodsList(params);
 *      setList(data);
 *    });
 * @param fc {function} 用户的点击方法体，若涉及http请求交互，需Promise化流程
 * @param options {object} 配置项
 */
function clickPendingWrap(fc, options?: Options): (...args) => Promise<any> {
  if (!isClient) {
    throw Error('clickPendingWrap() should be called in Client')
  }

  if (!isFunc(fc)) {
    throw Error('First param "fc" must be a function')
  }

  const { showSpinner, spinnerDelay, throttleDelay } = { ...DEFAULT_OPTIONS, ...(options || {}) }

  let pendingFlag = false // Promise-pending执行状态锁
  let promise = null
  let delayTimer = null
  let throttleLock = false // 节流锁

  return async function(...args) {
    if (throttleLock || pendingFlag) {
      return promise
    }

    throttleLock = true
    pendingFlag = true

    setTimeout(() => {
      throttleLock = false
    }, throttleDelay)

    // 处理需要过渡菊花的逻辑
    if (showSpinner) {
      delayTimer = setTimeout(() => {
        showSpinnerLoading()
      }, spinnerDelay)
    }
    try {
      promise = fc.apply(this, args)
      return await promise
    } catch (err) {
      throw err
    } finally {
      // 即便try中return了，finally里的代码依旧会执行
      if (showSpinner) {
        clearTimeout(delayTimer)
        hideSpinner()
      }
      pendingFlag = false
      promise = null
    }
  }
}

export { clickPendingWrap }
export default clickPendingWrap
