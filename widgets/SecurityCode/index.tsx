/**
 * 发送验证码组件，支持把倒计时缓存入本地Storage中
 * Note:
 *    点击“发送验证码”向后端发送HTTP请求的逻辑，交由 sendSecurityCode() 钩子由业务方来处理，
 *    而不是像原出稿那样 在组件内部大包大揽 inject('store') 实例化httpInst等，耦合过重，不
 *    符合纯粹UI组件的规范。
 */
import React, { memo, useState, useEffect, useRef } from 'react'
import useStyles from 'isomorphic-style-loader/useStyles'
import cn from 'classnames'

import { saveToLocal as saveToStore, getFromLocal as getFromStore } from 'utils/storage'
import clickPendingWrap from 'utils/clickPendingWrap'

import { IProps } from './types'
import s from './index.iso.scss'

const MOBILE_REG = /(^1)\d{10}$/

function SecurityCode(props: IProps) {
  useStyles(s)
  const {
    mobile = '',
    delay = 60,
    defaultText = '发送验证码',
    pendingText = '${sec}s后重试',
    errorApiTips = '获取验证码失败',
    cacheKey = 'comp_security_code',
    sendSecurityCode,
  } = props

  // “发送验证码”是否可点击
  const [enabled, setEnabled] = useState(null)
  const [codeMsg, setCodeMsg] = useState(null)
  const timerRef = useRef(null)
  const storeKey = `${cacheKey}_${mobile}`

  const clearCounter = () => clearInterval(timerRef.current)
  // 把pendingText中${sec}替换为实际倒计时
  const formatPendingText = (gap: number) => pendingText.replace(/\$\{sec\}/g, gap)

  /**
   * 倒计时逻辑
   * @param gap 倒计时时间（秒）
   */
  const countDown = (gap: number) => {
    setEnabled(false)
    setCodeMsg(formatPendingText(gap))

    timerRef.current = setInterval(() => {
      --gap
      setEnabled(false)
      setCodeMsg(formatPendingText(gap))

      // 倒计时结束时，复位
      if (gap < 0) {
        clearCounter()
        setEnabled(true)
        setCodeMsg(defaultText)
      }
    }, 1000)
  }

  /**
   * 发送验证码请求
   */
  const onSendCode = clickPendingWrap(async (mobile) => {
    if (!enabled) return

    if (typeof sendSecurityCode !== 'function') {
      throw Error('sendSecurityCode() is Required')
    }

    const { success } = await sendSecurityCode(mobile)
    if (!success) {
      console.log(errorApiTips)
      return
    }

    setEnabled(false)
    setCodeMsg(formatPendingText(delay))
    // 缓存当前号码校验发送的有效时间
    saveToStore(storeKey, Date.now() + delay * 1000)
    countDown(delay)
  })

  useEffect(() => {
    if (!MOBILE_REG.test(mobile)) {
      clearCounter()
      setEnabled(false)
      setCodeMsg(defaultText)
      return
    }

    const cachedExpiredTime = getFromStore(storeKey)
    const gap = ~~((cachedExpiredTime - Date.now()) / 1000) // 缓存时间差(秒)
    // console.log('didMount: ', gap, cachedExpiredTime, storeKey);

    // 缓存过期时 清除缓存
    if (gap <= 0) {
      saveToStore(storeKey, null)
      setEnabled(true)
      setCodeMsg(defaultText)
      return
    }

    /* 当前手机号码倒计时尚未结束时 */
    countDown(gap)
  }, [mobile])

  // console.log('render::: ', enabled);

  return (
    <div className={s.codeWrap}>
      <div className={cn(s.msg, !enabled && s.disabled)} onClick={onSendCode}>
        {codeMsg}
      </div>
    </div>
  )
}

export default memo(SecurityCode)
