import debounce from './debounce'

const FUNC_ERROR_TEXT = 'Expected a function'

// eslint-disable-next-line
interface IOptions {
  leading?: boolean
  trailing?: boolean
}

function throttle(func, wait, options?: IOptions) {
  if (typeof func !== 'function') {
    throw new TypeError(FUNC_ERROR_TEXT)
  }

  options = options || {}
  const leading = 'leading' in options ? !!options.leading : true
  const trailing = 'trailing' in options ? !!options.trailing : true

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  })
}

export default throttle
