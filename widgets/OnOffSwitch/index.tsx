/**
 * @file OnOffSwitch.js 设置中常用的开关组件（仿iOS按钮）
 * @author jiangxtx
 */

import React, { memo } from 'react'
import cn from 'classnames'

import { IProps } from './types'
import style from './index.module.scss'

function OnOffSwitch(props: IProps) {
  const { isOn, onSwitch, extraClass = '', disabled = false } = props

  return (
    <div className={cn(style.wrapper, extraClass)}>
      <div
        className={cn(style.container, !isOn && style.containerOff, disabled && style.disabled)}
        onClick={onSwitch}
      >
        <div className={style.switchBtn} />
      </div>
    </div>
  )
}

export default memo(OnOffSwitch)
