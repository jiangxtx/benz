/**
 * console控制台输出日志
 */
const isDev = process.env.NODE_ENV === 'development'
const logger = (type) => (...args) => {
  if (isDev) {
        console[type](...args); //eslint-disable-line
  }
}

const info = logger('info')
const warn = logger('warn')
const error = logger('error')

export { info, warn, error }
