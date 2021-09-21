
## 题目：模拟实现一个 Promise.finally

### 笔者的代码

思路：

1）首先应该明确`Promise.finally`的功能是什么？

就是无论当前的Promise实例的执行状态是`resolve`还是`reject`，都会执行到该方法体里。从这个角度看，很类似`try..catch..finally`中的`finally`使用模式。

2）`Promise.finally`接收的参数是什么？

应该是一个回调函数`callback`。

3）再去思考如何用`Promise`中其他既有的方法来实现`finally`功能？

核心便是重新包装一个`Promise`，不管它是`resolve`还是`reject`，都执行一遍`callback`回调即可。

依据上面的分析思路，下面上代码：

```js
Promise.prototype.ifinally = function (cb) {
    const O = Object(this);
    if (typeof O.then !== 'function') {
        throw new Error('ifinally is not used in a Promise');
    }
    if (typeof cb !== 'function') {
        return cb;
    }
    return this.then(data => {
        // console.log('ifinally then entered...');
        return Promise.resolve(cb(data))
          .then(() => data);
    }).catch(err => {
        // console.log('ifinally catch entered...');
        cb(err);
        return Promise.reject(err)
          .catch(() => throw err);
    });
};

/* TEST Codes */

Promise.reject('ja')
    .then(d => console.log('then..', d))
    .catch(err => {
        console.log('catch..', err);
        throw Error('bad name! ja!!');
    })
    .finally(d => console.log('finally..', d));
```

### 参考代码

以下是网上多个博客里给出的参考代码：

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

考虑的比较全面，比如 `finally`并不一定是在最后采取调用的，很可能还会在其后面继续链式调用。

