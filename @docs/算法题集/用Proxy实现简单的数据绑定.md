# 使用 JavaScript Proxy 实现简单的数据绑定

代码如下：

```js
const obj = {
  name: 'jack',
  age: 23
}

/**
 * 观察池子，承接整个观察者模式的中转
 * 说明：
 *   + 每一个key对应待观察对象
 *   + value是一个对象，包含对象的观察集，如：get/set/apply...符合Proxy规范
 * 示意：
 *    const observableData = observable(obj);
      observeCaches.set(observableData, {
        get: [cb1, cb2, ... ],
        set: [cb1, cb2, ... ],
      })
 */
const observeQueue = new Map();

/**
 * 把原始数据对象包装为可观察的对象
 * @param {*} obj 
 * @returns 
 */
function observable(obj) {
  if (obj == null || typeof obj !== 'object') {
    throw Error('obj is invalid');
  }
  const handler = {
    get(target, key, receiver) {
      (observeQueue.get(receiver).getO || []).forEach(cb => cb(target))
      return Reflect.get(target, key);
    },
    set(target, key, value, receiver) {
      const flag = Reflect.set(target, key, value)
      (observeQueue.get(receiver).setO || []).forEach(cb => cb(target))
      return flag;
    }
  }
  const receiver = new Proxy(obj, handler);
  observeQueue.set(receiver, {
    getO: [],
    setO: [],
  });
  return receiver;
}

function setObserve(data, cb) {
  if (!observeQueue.has(data)) {
    throw Error(`data should be wrapped with observable()`)
  }
  if (typeof cb === 'function') {
    observeQueue.set(data, [...observeQueue.get(data).setO, cb]);
  }
}

const data = observable(obj);
setObserve(data, (data) => {
  console.log('帮我观测 set：', data);
})
setObserve(data, (data) => {
  console.log('帮我观测 set12：', data);
})

// console.log('observeQueue: ', observeQueue);

data.pick = 'picker'
console.log(data.pick);
```
