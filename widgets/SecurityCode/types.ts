export interface IProps {
  /* 待发送验证码的手机号 */
  mobile: string
  /* 发送请求后的置灰延迟时间，默认60s */
  delay?: number
  /* 默认展示文本 */
  defaultText?: string
  /**
   * 倒计时文案，默认：'${sec}s后重试'
   * Note：${sec} 会被填充为实际的倒计时 其余文本被保留
   * ext. '请于${sec}s后重试' --> '请于36s后重试'
   */
  pendingText?: string
  /* 请求API出错的toast */
  errorApiTips?: string
  /* 缓存到本地Storage时key的前缀，来规避多个业务方同时使用时造成的key值冲突 */
  cacheKey?: string
  /**
   * 发送验证码的请求函数
   * Note：
   *    1. 函数返回需Promise化，推荐 async function.
   *    2. 返回值规范：{ success: true/false }，用来表示该请求成功与否
   */
  sendSecurityCode: (mobile) => Promise<any>
}
