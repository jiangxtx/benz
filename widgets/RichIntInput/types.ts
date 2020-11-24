export interface IProps {
  /* 容器包装类 */
  wrapClass?: string
  inputClass?: string
  /* 初始值 */
  number?: number
  /* 区间最小值 */
  minNum?: number
  /* 区间最大值 */
  maxNum?: number
  /* 减至最小值后的提示语 */
  minErrTips?: string
  /* 增至最大值后的提示语 */
  maxErrTips?: string
  /* 数值变化监听函数 */
  onNumberChange?: (num: number) => void
}
