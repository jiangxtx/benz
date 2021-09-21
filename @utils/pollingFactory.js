/**
 * 需求背景：
 *   货物清点页的大件清点情形下，当团长反馈清点有误后，页面需要及时轮询清点列表接口，来实时获取司机最新的清点情况。
 * 需求描述：
 *   1. 希望把这个轮询功能单独抽象出来，封装成一个公共的能力
 *   2. 业务方可控制轮询的时间间隔
 *   3. 业务方可控制轮询的开始、暂停、与结束
 *   4. 当页面离开 or 不显示时，轮询暂停；页面又显示时，轮询继续
 */

/**
 * 负责轮询
 * @param {*} cb 轮询到期的回调函数
 * @param {*} options 额外配置项
 */
class PollingFactory {
  constructor(cb, options) {
    this.cb = cb
    this.options = options || {}
    this.timer = null
    this.isDestoried = false // 是否已销毁
    this.isPolling = false // 是否正在轮询中
    this.__init()
  }

  __init() {
    if (typeof window === 'undefined') {
      throw new Error('PollingFactory should be used in Client.')
    }
    if (typeof this.cb !== 'function') {
      throw new Error('cb should be a function.')
    }

    const { immediate = true } = this.options
    immediate && this.__startPoll()
    window.addEventListener('visibilitychange', this.__onVisibleChange, false)
    return this
  }

  __onVisibleChange = () => {
    if (document.hidden) {
      this.pause()
    } else {
      this.start()
    }
  }

  /**
   * 开启轮询
   * @param innerFlag 内部递归轮询标识
   */
  __startPoll(innerFlag) {
    if (this.isDestoried) return

    const { delay = 1000, trailing = true } = this.options
    trailing && !innerFlag && this.cb && this.cb()
    this.timer = setTimeout(() => {
      this.cb && this.cb()
      this.timer = null
      this.__startPoll(true)
    }, delay)
  }

  /**
   * 暂停轮询
   */
  __pausePoll() {
    this.timer && clearTimeout(this.timer)
    this.timer = null
    this.isPolling = false
  }

  /**
   * 销毁轮询
   */
  destroy() {
    this.isDestoried = true
    this.isPolling = false
    this.timer && clearTimeout(this.timer)
    this.timer = null
    this.cb = null
    window.removeEventListener('visibilitychange', this.__onVisibleChange)
  }

  start() {
    // 防止重复开启
    if (this.isPolling) return
    this.isPolling = true
    this.__startPoll()
  }

  pause() {
    this.__pausePoll()
  }
}

export default PollingFactory

/* *********** TEST ************** */

let i = 1
function cb() {
  console.log('cb: ', i++)
}
const poll = new PollingFactory(cb, { delay: 2000 })
