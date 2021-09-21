/**
 * @description: 精简lodash库中的方法集，旨在替代lodash库（体积太大）。
   + 对外提供与lodash原生方法一样的函数调用
   + 只暴露了几个实际开发中最为常用的方法：get / throttle / debounce / memoize，
   + 其余能用ES6原生函数的，都用JS原生方法 or 简单封装一下即可
 * @author: jiangxtx
 */

export { default as get } from './get'
export { default as memoize } from './memoize'
export { default as throttle } from './throttle'
export { default as debounce } from './debounce'
