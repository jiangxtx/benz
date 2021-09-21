/**
 * @file isClient.js 判断宿主是否为客户端
 * Note：在具体的项目中，也可以通过webpack打包配置一些参数来作为识别，
 *      e.g. const isClient = process.env.BROWSER === true
 *
 * @author jiangxtx
 */

const isClient = typeof window !== 'undefined'
// const isClient = process.env.BROWSER === true

export default isClient
