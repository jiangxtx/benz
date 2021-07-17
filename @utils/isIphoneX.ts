/**
 * 判断是否为 iPhone X 机型
 */
export function isIphoneX(): boolean {
  if (typeof window !== 'object') {
    return false
  }

  return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812
}
