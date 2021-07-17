/**
 * 直接针对DOM的一系列操作集
 */

import isClient from '../isClient'

/**
 * 获取节点的滚动Top值
 * Note：直接参考了 @dd/ui-util 中 getScrollTop() 的源码
 * @param {*} node DOM节点
 */
export function getScrollTop(node?: HTMLElement): number {
  if (!isClient) return

  if (node && node !== document.body) {
    return node.scrollTop
  }

  return document.body.scrollTop + ((document.documentElement || {}).scrollTop || 0)
}

/**
 * 设置节点的节点的滚动Top值
 * Note：直接参考了 @dd/ui-util 中 setScrollTop() 的源码
 * @param {Number} value top值
 * @param {*} node DOM节点
 */
export function setScrollTop(value: number, node?: HTMLElement): any {
  if (!isClient) return

  if (node && node !== document.body) {
    node.scrollTop = value
    return node
  }

  if (value === 0) {
    document.body.scrollTop = 0
    if (document.documentElement) {
      document.documentElement.scrollTop = 0
    }
    return null
  }

  document.body.scrollTop = value
  if (document.body.scrollTop !== 0) {
    return document.body
  }

  if (document.documentElement) {
    document.documentElement.scrollTop = value
    if (document.documentElement.scrollTop !== 0) {
      return document.documentElement
    }
  }

  return false
}

/**
 * 获取div相对于container的offsetTop值，若container没传，则默认相对于body元素。
 * Note：直接参考了 @dd/ui-util 中 getOffsetTop() 的源码
 * @param {*} div
 * @param {*} container
 */
export function getOffsetTop(div: HTMLDivElement, container: HTMLDivElement): number {
  if (!isClient) return

  let offset = 0
  while (div) {
    if (div === container) {
      break
    }
    offset += div.offsetTop
    // @ts-ignore
    div = div.offsetParent
  }
  return offset
}

let windowWidth = 0

/**
 * 获取当前屏幕的宽度（单位px）
 * Note：部分参考了 @/ui-util 中 getWindowWidth() 的源码
 */
export function getWindowWidth(): number {
  if (!isClient) return

  if (windowWidth) {
    return windowWidth
  }

  windowWidth = window.innerWidth || document.body.offsetWidth || 375
  return windowWidth
}

/**
 * 依据el元素来获取对应的原生DOM元素
 * @param el {String|HTMLElement|null}
 */
export function getNode(el): HTMLElement {
  if (!isClient) return null

  if (typeof el === 'string') {
    return document.getElementById(el)
  }

  if (el instanceof HTMLElement && el.nodeType === 1) {
    return el
  }

  return null
}
