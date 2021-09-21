# 手动实现一个EventEmitter类

## 要求

手动实现一个发布订阅的EventEmitter类，要求包含以下几个最常用的接口：

- `on`: 订阅事件
- `off`: 取消已订阅的事件
- `emit`: 发布事件
- `once`: 订阅事件，并且只执行一次

## V1.0 实现

以下是第一版初版的实现，比较简单直接，还有很多因素没考虑进去。后续要对标大名鼎鼎的`eventemitter3`库来优化代码。

```js
class EventEmitter {
    caches = {};
    /**
     * 订阅某事件
     * @param {*} key 
     * @param {*} fc 
     */
    on(key, fc) {
        if (key == null || typeof fc !== 'function') return;

        this.caches[key] = this.caches[key] || [];
        this.caches[key].push(fc);
    }
    /**
     * 取消订阅某事件
     * @param {*} key 
     * @param {*} fc 
     */
    off(key, fc) {
        // console.log('off: ', key, fc, this.caches[key]);       
        if (key == null || !this.caches[key]) return;
        if (fc == undefined) {
            return this.caches[key] = [];
        }
        this.caches[key] = this.caches[key].filter(item => item !== fc);
    }

    /**
     * 发布某事件
     * @param {*} key 
     */
    emit(key, ...args) {
        if (key == null || !this.caches[key]) return;
        this.caches[key].forEach(cb => cb.apply(this, args));
    }

    /**
     * 订阅某事件（只执行一次）
     * @param {*} key 
     * @param {*} fc 
     */
    once(key, fc) {
        if (key == null || typeof fc !== 'function') return;
        const wrapFunc = (...args) => {
            fc.apply(this, args);
            // 控制fc只执行一次即被销毁
            this.off(key, wrapFunc);
        }
        this.caches[key] = this.caches[key] || [];
        this.caches[key].push(wrapFunc);
    }
}

const events = new EventEmitter();


/* TEST Codes */

const onceF = () => console.log('just 1 time');
const onF = () => console.log('so many times');
const key = 'listen';
events.on(key, onF);
events.once(key, onceF);

events.emit(key);
events.emit(key);
events.emit(key);
events.emit(key);
events.emit(key);

```

## 优化方向

上面V1.0代码，可优化的方向有：

1. 目前`caches`是一个`Object`对象，可考虑用`Map`来扩展`key`的范围，并提升查找性能
2. `maxListeners`数量
3. 消息订阅函数在执行时`this`的作用域问题
4. 参考`eventemitter3`，给同一实例的`events`下，统一追加订阅消息名称的`prefix`

## eventemitter3说明

再通读了一遍`eventemitter3`的源码后，有几点必须要郑重说明一下，不吐不快。

一，`eventemitter3`源码考虑得很周全，代码细节处理也相当优雅。不得不叹服。

二，由于`eventemitter3`考虑适用性与兼容性很深邃，所以它全部采用`EcmaScript 3`规范书写，用官方文档里的话形容，即：

> Free performance, who wouldn't want that? The EventEmitter is written in EcmaScript 3, so it will work in the oldest browsers and node versions that you need to support.

不过话又说回来了，正是基于此，我们看到源码里的诸多细节部分，乍一看时，反倒显得云里雾里。比如下面这个函数实现：

```js
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}
```

其中，里面的`if-else-if`把我绕得晕乎乎的。细细梳理了一下，发现，本质上与下面的代码其实并没有什么区别，当然了，纯粹的`ES3`规范书写，兼容性更好。

```js
this._events[key] = this._events[key] || [];
this._events[key].push(fn);
```

三，对性能的极致追求，都体现在代码的细节上。

比如`emit`方法的传参，就采用了显示接受`a1`~`a5`等 5 个用户传参，然后不遗余力的通过`switch`逻辑进行一一处理。这么做，乍一看倒显得很冗余，且有失代码的雅观。但是，细细品来，容我斗胆猜测：**应该是追求极致性能的结果吧**，毕竟通常使用看来，用户顶多也就传2~3个参数了。这5个传参场景，足矣覆盖了`99%`以上的情形。

再比如，`eventemitter3`中对消息订阅的事件池处理，与上面`V1.0`代码有着根本的不同。`eventemitter3`中，当消息A只有一个事件时，直接以`Object`对象来存储，当有多个事件时，又把对象存储变为了`Array`对象来存储。而`V1.0`代码中，则直接无脑的进行了如下处理：`this.caches[key] = this.caches[key] || [];`。

那么，究竟孰优孰劣呢？还得以客观事实来说话。实际业务使用时，超过`80%`的概率，都是基于一个消息一个事件的模式来开发需求的。在这样的场景下，单独拎出来处理，不可谓不匠心独运啊。

