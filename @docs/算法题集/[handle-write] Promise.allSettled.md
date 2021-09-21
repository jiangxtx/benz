
## 题目：模拟实现一个 Promise.allSettled

### 笔者的代码

思路：

从 `ES2020` 开始，你可以使用 `Promise.allSettled`。当所有的 `promises` 都已经结束，无论是完成状态或者是失败状态，它都会返回一个 `promise`，这个 `promise` 将会包含一个关于描述每个 `promise` 状态结果的对象数组。

对于每个结果对象，都有一个状态字符串：

+ fulfilled(完成) ✅
+ rejected(失败) ❌

返回值（或原因）表现每个 promise 的完成（或失败）。

依据上面的分析思路，下面上代码：

```js
Promise.iallSettled = function (...args) {
    const isPromise = (value) => value && typeof value.then === 'function';
    const list = [].slice.call(...args)
        .map(item => isPromise(item) ? item : Promise.resolve(item));
    let count = 0;
    const res = [];

    return new Promise((resolve, reject) => {
        list.forEach((promise, index) => {
            promise.then(data => {
                count++;
                res[index] = {status: 'fullfilled', vlaue: data};
                if(count === list.length) {
                    resolve(res);
                }
            }).catch(err => {
                count++;
                res[index] = {status: 'rejected', value: err};
                if(count === list.length) {
                    resolve(res);
                }
            })
        })
    })
}
```

**注意：**

`iallSettled`是Promise 的一个静态方法，不要写成`Promise.prototype.iallSettled`.

### 测试


```js
const sleep = function (delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {resolve('sleep over')}, delay)
    })
}
var p = Promise.iallSettled([
    'jackson',
    Promise.resolve('OKkk'),
    Promise.reject(new Error('ops err')),
    sleep(2500),
])
console.log('p:: ', p.then(data => {
    console.log('res: ', data);
}));
```

本地测试通过。
