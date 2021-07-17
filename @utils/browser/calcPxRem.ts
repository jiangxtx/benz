import isClient from '../isClient'

const BASE_FONT_SIZE = 100 // 默认HTML基准为font-size: 100px;
let htmlFontSize = 0

/**
 * 把fontSize中的rem解析为px. 常用用UI组件的style转换
 * 示例：
 *    remToPx(.32) --> '32px'
 *    remToPx('.32rem') --> '32px'
 *
 * @param rem fontSize值
 */
export function remToPx(rem: number | string): string {
  rem = parseFloat(rem + '')
  if (isNaN(rem)) {
    throw new Error('remToPx() parse Error')
  }

  if (!isClient) {
    return rem * BASE_FONT_SIZE + 'px'
  }

  // 客户端缓存HTML的font-size {Number}
  htmlFontSize = htmlFontSize || parseFloat(getComputedStyle(document.documentElement).fontSize)
  return rem * htmlFontSize + 'px'
}

/**
 * 把fontSize中的px解析为rem. 常用用UI组件的style转换
 * 示例：
 *    remToPx('32px') --> '0.32rem'
 *    remToPx(32) --> '0.32rem'
 *
 * @param rem fontSize值
 */
export function pxToRem(px: number | string): string {
  px = parseFloat(px + '')
  if (isNaN(px)) {
    throw new Error('pxToRem() parse Error')
  }

  if (!isClient) {
    return px / BASE_FONT_SIZE + 'rem'
  }

  // 客户端缓存HTML的font-size {Number}
  htmlFontSize = htmlFontSize || parseFloat(getComputedStyle(document.documentElement).fontSize)
  return px / htmlFontSize + 'rem'
}
