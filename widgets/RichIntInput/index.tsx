/**
 * 富文本整数输入框组件，支持递增或递减操作
 * UI形如：https://funimg.pddpic.com/timeline/rich-number.jpg
 */
import React, { memo, useState } from 'react'
import cn from 'classnames'
import useStyles from 'isomorphic-style-loader/useStyles'

import { toastInfo } from 'widgets/cui-toast'

import { IProps } from './types'
import s from './index.iso.scss'

/**
 * 统一Input值的规范
 * Note：控制为{String}类型，可有效控制{Number}类型下的首字符为0的问题
 * @param value
 */
function uniInputVal(value): string {
  return value != null ? value + '' : ''
}

/**
 * 计算初始展示值
 * @param init
 * @param min
 * @param max
 */
function calcInitNum(init, min, max) {
  if (min != null && init < min) {
    return uniInputVal(min)
  }

  if (max != null && init > max) {
    return uniInputVal(max)
  }

  return uniInputVal(init)
}

const MIN_ERR_TIPS = '已减至最低值'
const MAX_ERR_TIPS = '已增至最高值'
const INVALID_TIPS = '仅支持整数'

const DIGIT_REX = /^(-|\d)\d*$/ // 仅支持整数的正则表达式

function RichNumber(props: IProps) {
  useStyles(s)
  const {
    wrapClass,
    inputClass,
    number,
    minNum,
    maxNum,
    minErrTips = MIN_ERR_TIPS,
    maxErrTips = MAX_ERR_TIPS,
    onNumberChange,
  } = props
  const [value, setValue] = useState(calcInitNum(number, minNum, maxNum))

  const changeValue = (value) => {
    if (typeof onNumberChange === 'function') {
      onNumberChange(value)
    }
    setValue(value)
  }

  const onChange = (e) => {
    let value = e.target.value || ''

    if (!DIGIT_REX.test(value)) {
      toastInfo(INVALID_TIPS)
      return
    }

    value = +value

    if (minNum != null && value < +minNum) {
      toastInfo(minErrTips)
      changeValue(uniInputVal(minNum))
      return
    }

    if (maxNum != null && value > +maxNum) {
      toastInfo(maxErrTips)
      changeValue(uniInputVal(maxNum))
      return
    }

    changeValue(uniInputVal(value))
  }

  const onDecrease = () => {
    const destNum = +value - 1
    if (minNum != null && destNum < +minNum) {
      toastInfo(minErrTips)
      return
    }

    changeValue(uniInputVal(destNum))
  }

  const onIncrease = () => {
    const destNum = +value + 1
    if (maxNum != null && destNum > +maxNum) {
      toastInfo(maxErrTips)
      return
    }

    changeValue(uniInputVal(destNum))
  }

  const minDisabled = minNum != null && +value <= +minNum
  const maxDisabled = maxNum != null && +value >= +maxNum

  return (
    <div className={cn(s.wrap, wrapClass)}>
      <div className={cn(s.oper, s.decrease, minDisabled && s.disabled)} onClick={onDecrease}>
        -
      </div>
      <input
        type="number"
        className={cn(s.numberInput, inputClass)}
        value={value}
        onChange={onChange}
      />
      <div className={cn(s.oper, s.increase, maxDisabled && s.disabled)} onClick={onIncrease}>
        +
      </div>
    </div>
  )
}

export default memo(RichNumber)
