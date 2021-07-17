/**
 * @file clipboard.js 写入系统剪切板
 * @author jiangxtx
 */
import { getCurrentPlatform, SYSTEM } from '@benz/platform-util'
import isClient from '../isClient'

/**
 * 把数据写入系统剪切板
 * Note that: 必须手动调用该方法才会生效，纯JS调用无效！
 * @param {String} value
 */
function writeToClipboard(value: string, cb): void {
  if (!isClient) {
    throw Error('wirteToClipboard should be called in Client.')
  }

  if (value == null) {
    console.warn('value should not be null.')
    return
  }

  value = value + ''
  const input = document.createElement('input')
  input.value = value
  input.type = 'text'
  input.setAttribute('style', 'position: absolute;top: -10000px;')
  input.setAttribute('readonly', 'readonly')

  const selectText = () => {
    let range
    let selection
    if (getCurrentPlatform().system === SYSTEM.IOS) {
      range = document.createRange()
      range.selectNodeContents(input)
      selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      input.setSelectionRange(0, value.length)
    } else {
      input.select()
    }
  }
  selectText()

  const flag = document.execCommand && document.execCommand('copy')
  // console.log('inputNode: ', inputNode, flag)
  if (!flag) {
        console.error('写入剪切板失败，请确保有用户行为操作 or 检查系统是否支持document.execCommand'); // eslint-disable-line
  }
  if (typeof cb === 'function') {
    cb(flag)
  }

  setTimeout(() => {
    document.body.removeChild(input)
  }, 0)
}

export { writeToClipboard }

export default writeToClipboard
