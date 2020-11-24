/**
 * 哨兵组件，通常用于监听IntersectionObserver事件
 */
import React, { memo, useRef, useEffect } from 'react'
import { getNode } from 'utils/browser/dom'

import { IProps } from './types'

function Sentinel(props: IProps) {
  const { root, rootMargin, thresholds, wrapClass, style, onIntersecting } = props
  const rootRef = useRef(null)
  const ioRef = useRef(null)

  const observerCallback = (entries) => {
    if (entries[0].isIntersecting && typeof onIntersecting === 'function') {
      onIntersecting(entries[0])
    }
  }

  useEffect(() => {
    ioRef.current = new IntersectionObserver(observerCallback, {
      root: getNode(root),
      rootMargin,
      // @ts-ignore
      thresholds,
    })
    ioRef.current.observe(rootRef.current)

    return ioRef.current.disconnect
  }, [])

  return (
    <div
      ref={rootRef}
      className={wrapClass}
      style={{
        height: '1px',
        ...style,
      }}
    />
  )
}

export default memo(Sentinel)
