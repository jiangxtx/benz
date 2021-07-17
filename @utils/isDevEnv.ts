/**
 * @file isDevEnv.ts 判断当前环境是否为开发环境
 * Note：在具体的项目中，需结合webpack打包配置来作为识别，
 *
 * @author jiangxtx
 */

const isDevEnv = process.env.NODE_ENV !== 'production'

export default isDevEnv
