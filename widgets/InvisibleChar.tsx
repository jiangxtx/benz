/**
 * 显示不可见字符组件，用于hack修复iOS下绘制缓慢问题
 * Note：该组件在大多多C端被广泛应用，可显著提升iOS下的绘制性能
 * @author xiusi
 */
import React, { memo } from 'react'

interface IProps {
  /* 是否显示不可见字符 */
  show?: boolean
  /* 不可见字符的显示个数,默认200 */
  totalChars?: number
}

/**
 * 显示不可见字符组件，用于hack修复iOS下绘制缓慢问题
 * @param props
 * @returns {null|*}
 */
function InvisibleChar(props: IProps) {
  const { show, totalChars = 200 } = props

  if (!show || typeof totalChars !== 'number' || !totalChars) {
    return null
  }

  return <div style={{ height: 0 }}>{'\u200b'.repeat(totalChars)}</div>
}

export default memo(InvisibleChar)
