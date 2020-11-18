/**
 * @file isWebpSupported.js 浏览器是否支持 webp 格式图片
 * @author jiangxtx
 */
import isClient from 'utils/isClient'

let isSupported = null
const WEBP_KEY = 'webp'

type Cookies = {
  [WEBP_KEY]: string
}

interface IRequest {
  cookies: Cookies
}

function isWebpSupported(req?: IRequest): boolean {
  if (isClient) {
    // Client端允许缓存该值，因为代码一旦运行了，都位于同一个浏览器宿主下。
    if (isSupported != null) {
      return isSupported
    }

    try {
      isSupported =
        document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0
    } catch (e) {
      isSupported = false
    }
    return isSupported
  }

  if (typeof req !== 'object') {
    throw Error('Param "req" is required in SSR mode.')
  }

  // Server每次都需重新获取，禁止缓存该变量！因为面向的是不同的Client端。
  // TODO...服务端自定义逻辑，一般存于cookie，或者可以根据 Accept 里面是否有 image/webp 进行判断
  return req && req.cookies[WEBP_KEY] === '1'
}

export default isWebpSupported
