/**
 * @file RichInputWrap.js textarea编辑器
 * 提供基本的文本输入 & 剩余字数提示的能力，可以设置最大长度限制。
 *
 * @author jiangxtx
 */

import React, { memo, useState, useRef, useEffect } from 'react'
import cn from 'classnames'

import { fixInputBlurBug } from './util'
import { IProps } from './types'
import style from './index.module.scss'
import './index.scss'

function noop() {} // eslint-disable-line

// 当字数超出上限时的文本处理类型：尾部截断 / 保留原有文本
const OVERLOAD_CUT_TYPE = {
  tail: 'tail',
  keep: 'keep',
}

function RichInputWrap(props: IProps) {
  const {
    noHeadSpace = true,
    noTailSpace = false,
    autofocus = true,
    placeholder = '请输入',
    maxLen = 200,
    highlightLen = 10,
    initVal = '',
    needOuterValidate = false,
    onValueChange = noop,
    id,
    classWrap,
    textareaClass,
    tipsClass,
    showLeftNumTip = true,
    useInput = false,
    overloadCutType = OVERLOAD_CUT_TYPE.keep,
  } = props
  const [value, setValue] = useState(initVal || '')
  const textRef = useRef(null)
  const isInputZnRef = useRef(false) // 中文输入

  const warningLen = maxLen - highlightLen

  useEffect(() => {
    const textarea = textRef && textRef.current
    if (autofocus && textarea) {
      // 自动唤起键盘
      setTimeout(() => {
        // console.log('focus...')
        textarea.focus()
        // 下面两行代码处理focus在了开头的bug
        textarea.value = ''
        textarea.value = initVal
      }, 500)
    }
  }, [])

  const onInput = async () => {
    if (isInputZnRef.current) return

    const node = textRef.current || {}
    let newVal = node.value || '' // 最新输入的文本消息

    if (noHeadSpace) {
      newVal = newVal.replace(/^\s\s*/, '') // 去除开头空格
    }
    if (noTailSpace) {
      newVal = newVal.replace(/\s\s*$/, '') // 去除尾部空格
    }

    // console.log('onInput: ', newVal, maxLen, value)
    // 当输入文本超出最大字数限制时，默认保持上一次的输入不变
    if (newVal.length > maxLen) {
      newVal = overloadCutType === OVERLOAD_CUT_TYPE.keep ? value : newVal.substr(0, maxLen)
    }

    // 是否需要外部校验，如果需要，onValueChange() 返回 Promise 化的校验后值。
    if (needOuterValidate) {
      const destVal = await onValueChange(newVal)
      // console.log('on val change: ', destVal, typeof destVal)
      if (typeof destVal === 'string') {
        newVal = destVal
      }
    } else {
      // 无需外部校验时 纯粹发起回调
      onValueChange(newVal)
    }

    node.value = newVal // 限制显示的最多文字
    setValue(newVal)
  }

  const onCompositionStart = () => {
    isInputZnRef.current = true
  }

  const onCompositionEnd = () => {
    isInputZnRef.current = false
    onInput()
  }

  const valLen = value.length
  const commProps = {
    id,
    ref: textRef,
    placeholder,
    onCompositionStart,
    onCompositionEnd,
    // value, // 此处不能用受控组件 否则响应中文输入会有bug
    defaultValue: value,
    onInput,
    onBlur: fixInputBlurBug,
  }

  // 剩余字数提示
  const leftNumTipsJSX = () => {
    return (
      !!showLeftNumTip && (
        <div className={cn(style.leftTips, tipsClass)}>
          <span className={valLen >= warningLen && style.warning}>{valLen}</span>/{maxLen}
        </div>
      )
    )
  }

  if (useInput) {
    return (
      <div className={cn(style.inputWrap, classWrap)}>
        <input
          {...commProps}
          autoFocus // 不能这么粗暴的加，否则iOS中 H5页面被顶起来了
        />
        {leftNumTipsJSX()}
      </div>
    )
  }

  return (
    <div className={cn(style.wrap, classWrap)}>
      <textarea
        {...commProps}
        autoFocus // 不能这么粗暴的加，否则iOS中 H5页面被顶起来了
        className={cn(style.textarea, textareaClass)}
      />
      {leftNumTipsJSX()}
    </div>
  )
}

export default memo(RichInputWrap)
