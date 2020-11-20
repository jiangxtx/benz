export interface IProps {
  /* 是否开启状态 */
  isOn: boolean
  /* 额外class类 */
  extraClass?: string
  /* 是否禁用Switch */
  disabled?: boolean
  /* 切换Switch事件 */
  onSwitch: () => void
}
