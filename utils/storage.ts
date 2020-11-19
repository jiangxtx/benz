/**
 * 浏览器端localStorage & sessionStorage的函数封装
 * Note：该库已稳定并良好的服务于「社交项目」。
 * @author: jiangxtx
 */

function saveMain(key: string, val: any, storage: any) {
  if (!key) return

  if (val == null) {
    storage.removeItem(key)
    return
  }

  storage.setItem(key, JSON.stringify(val))
}

/**
 * 把数据存储到localStorage
 * Note: 当value为null、undefined时，即表示清空Storage中key对应的value
 * @param key
 * @param val
 */
function saveToLocal(key: string, val: any): void {
  if (typeof localStorage === 'undefined') return

  saveMain(key, val, localStorage)
}

/**
 * 把数据存储到sessionStorage
 * @param key
 * @param val
 */
function saveToSession(key: string, val: any): void {
  if (typeof sessionStorage === 'undefined') return

  saveMain(key, val, sessionStorage)
}

function getVal(key: string, storage: any) {
  if (key == null) return null

  let val = null
  try {
    val = JSON.parse(storage.getItem(key))
  } catch (e) {
    // eslint-disable-next-line
    console.error('getVal() Error while parsing value: ', e);
  }
  return val
}

/**
 * 从localStorage中获取key对应的value
 * @param key
 * @param val
 */
function getFromLocal(key: string): any {
  if (typeof localStorage === 'undefined') return undefined

  return getVal(key, localStorage)
}

/**
 * 从sessionStorage中获取key对应的value
 * @param key
 * @param val
 */
function getFromSession(key: string): any {
  if (typeof sessionStorage === 'undefined') return undefined

  return getVal(key, sessionStorage)
}

export { saveToLocal, saveToSession, getFromLocal, getFromSession }
