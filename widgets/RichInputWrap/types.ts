export interface IProps {
  /* 禁止头部空格输入，默认true */
  noHeadSpace?: boolean
  /* 禁止尾部空格输入，默认false */
  noTailSpace?: boolean
  /* 自动唤起键盘 默认true */
  autofocus?: boolean
  /* 占位文案 */
  placeholder?: string
  /* 文本最大长度（超出长度截断）默认200 */
  maxLen?: number
  /* 展示剩余字数，默认true */
  showLeftNumTip?: boolean
  /* 高亮剩余字数的长度 */
  highlightLen?: number
  /* 初始值 */
  initVal?: string
  /* 是否需要外部校验，如果需要，onValueChange()返回Promise化的校验后值 */
  needOuterValidate?: boolean
  /* 必填，输入值改变事件 */
  onValueChange: (string) => void | Promise<any>
  /* input or textarea的ID */
  id?: string
  classWrap?: string
  textareaClass?: string
  tipsClass?: string
  /* 是否启用input 来代替 textarea，默认为false */
  useInput?: boolean
  /**
   * 当字数超出上限时的文本处理类型, 两个取值：
   *    + 'tail': 尾部截断
   *    + 'keep': 保留原有文本
   */
  overloadCutType?: string
}
