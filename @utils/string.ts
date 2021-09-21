/**
 * 字符串转换：依据给定的split来转化为驼峰
 * Note：会移除首尾的split，多个split会被一并处理
 * ext.
 *  toCamel('jack_son_hao_col')         --> 'jackSonHaoCol'
 *  toCamel('-jack-son--hao--col-', '-')   --> 'jackSonHaoCol'
 * @param {*} str
 */
export function toCamel(str: string, split = '_'): string {
  if (typeof str !== 'string') {
    return str
  }

  const multiSplit = `\\${split}{1,}`
  const startReg = new RegExp(`^${multiSplit}`)
  const endReg = new RegExp(`${multiSplit}$`)
  return str
    .replace(startReg, '')
    .replace(endReg, '')
    .replace(new RegExp(`${multiSplit}(\\w)`, 'g'), (_, letter) => letter.toUpperCase())
}

/**
 * 字符串转换：下划线转驼峰
 * Note：会移除首尾的"_"，多个"_"会被一并处理
 * @param {*} str
 */
export function underline2Camel(str: string): string {
  return toCamel(str, '_')
}

/**
 * 驼峰转下划线
 * @param str
 */
export function camel2Underline(str: string): string {
  if (typeof str !== 'string') return str

  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '') /* 移除开头的“_” */
}
