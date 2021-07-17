/**
 * @file cssPrefix.js CSS样式的prefix兼容处理集
 * @author jiangxtx
 */
import isClient from '../isClient'

let prefix = ''

if (isClient) {
  // eslint-disable-next-line
  prefix = (function () {
    const div = document.createElement('div')
    const cssText =
      '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;'
    div.style.cssText = cssText
    const style = div.style

    if (style.webkitTransition) {
      return '-webkit-'
    }

    // @ts-ignore
    if (style.MozTransition) {
      return '-moz-'
    }

    // @ts-ignore
    if (style.oTransition) {
      return '-o-'
    }

    // @ts-ignore
    if (style.msTransition) {
      return '-ms-'
    }

    return ''
  })()
}

const upperCaseFirstChar = (str = ''): string => str.charAt(0).toUpperCase() + str.substr(1)

/**
 * 给css补充浏览器兼容前缀
 * e.g. prefixCss('transform') -> 'WebkitTransform';
 * @param css
 */
function prefixCss(css: string): string {
  const parsePrefix = prefix.replace(/-/g, '')
  if (parsePrefix === '') {
    return css
  }

  return upperCaseFirstChar(parsePrefix) + upperCaseFirstChar(css)
}

export { prefixCss }

export default prefix
