/**
 * @file util.js
 * @author jiangxtx
 */
// @ts-ignore
import { getCurrentPlatform, compareVersion, SYSTEM } from '@/platform-util'
import isClient from 'utils/isClient'

const platformInst = isClient ? getCurrentPlatform() : {}

/**
 * 解决微信ios12.1收回软键盘聊天页面不向下缩回的bug
 */
export function fixInputBlurBug(): number {
  // window.scrollTo(0, 0);
  if (
    platformInst.system === SYSTEM.IOS &&
    compareVersion(platformInst.systemVersion, '12.0') >= 0 &&
    typeof window !== 'undefined' &&
    typeof window.scrollTo === 'function'
  ) {
    const resizeTimer = setTimeout(() => window.scrollTo(0, 0), 80)
    return resizeTimer
  }
}
