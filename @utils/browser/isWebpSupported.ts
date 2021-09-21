/**
 * @file isWebpSupported.js 浏览器是否支持 webp 格式图片
 * @author jiangxtx
 */
import isClient from '../isClient'

let isSupported = null
const WEBP_KEY = 'webp'

interface ICookies {
  [WEBP_KEY]: string
}

interface IRequest {
  cookies: ICookies
}

function isWebpSupported(req?: IRequest): boolean {
  if (isClient) {
    // Client端允许缓存该值，因为代码一旦运行了，都位于同一个浏览器宿主下。
    if (isSupported != null) {
      return isSupported
    }

    /**
     * 判断是否支持webp的方法有几种：
     * 1）通过img.onload来判断img的width、height是否有效，属于异步操作。
     *    如果代码一开始运行，便通过此法来获取isWebpSupported，存在着第一次判断不准确的风险。
     * 2）即下面的document.createElement('canvas')判断，属于同步操作。
     *    该方法的一大优点：判断实时有效，不存在时差。当然了，缺点也有：兼容性不如第一种。
     */
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
  /**
   * TODO: ... 服务端自定义逻辑，一般存于cookie，或者可以根据 Accept 里面是否有 image/webp 进行判断
   * 下面是多多内部的判断方法，直接存入cookie，简单高效。
   */
  return req && req.cookies[WEBP_KEY] === '1'
}

export default isWebpSupported
