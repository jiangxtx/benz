## 设计 LazyMan 类

要求设计一个 LazyMan 类，能够实现以下功能：

```js
LazyMan('Tony'); // Passed
// Hi I am Tony

LazyMan('Tony').sleep(3).eat('lunch'); // Passed
// Hi I am Tony
// 等待了3秒...
// I am eating lunch

LazyMan('Tony').eat('lunch').sleep(4).eat('dinner');
// Hi I am Tony
// I am eating lunch/
// 等待了4秒...
// I am eating diner

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(2).sleep(5).eat('junk food');
// Hi I am Tony
// 等待了2秒...
// I am eating lunch
// I am eating dinner/
// 等待了5秒...
// I am eating junk food
```

### 仲夏给出的代码

```js
function LazyMan(name) {
  const log = (...args) => console.log(...args, Date.now()); // eslint-disable-line
  const sleep = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay * 1000));
  const qmt = queueMicrotask;

  class MyLazyMan {
      name;
      taskQueue = [];
      running = false;

      constructor(name) {
          this.name = name;
          this.taskQueue.push(() => log(`Hi I am ${this.name}`));
          // 在下一个微任务中执行所有任务队列
          queueMicrotask(this.runTask);
      }
      runTask = async () => {
          log('runTask: ', this.taskQueue);
          let task = this.taskQueue.shift();
          while (typeof task === 'function') {
              await task();
              task = this.taskQueue.shift();
          }
      }
      eat(val) {
          this.taskQueue.push(() => log(`I am eating ${val}`));
          // qmt(this.runTask);
          return this;
      }
    sleepFirst(delay) {
        // 紧跟在构造函数中推入任务的后面
          this.taskQueue.splice(1, 0, async () => {
              log(`sleepFirst:开始等待 ${delay} 秒`);
              await sleep(delay);
              log(`sleepFirst:等待了 ${delay} 秒`);
          });
          // qmt(this.runTask);
          return this;
      }
      sleep(delay) {
          this.taskQueue.push(async () => {
              log(`sleep:开始等待 ${delay} 秒`);
              await sleep(delay);
              log(`sleep:等待了 ${delay} 秒`);
          });
          // qmt(this.runTask);
          return this;
      }
  }

  return new MyLazyMan(name);
}
```

### 

```js
function LazyMan(name) {
    const log = (...args) => console.log(...args, Date.now()); // eslint-disable-line
    class MyLazyMan {
        name;
        taskQueue;

        constructor(name) {
            this.name = name;
            this.taskQueue = [];
            log('My name is: ' + this.name);
            queueMicrotask(() => {
                this.next();
            });
        }
        next() {
            const cb = this.taskQueue.shift();
            if (typeof cb === 'function') {
                cb();
            }
        }

        eat(value) {
            const cb = () => {
                log('eating ' + value);
                this.next();
            };
            this.taskQueue.push(cb);
            return this;
        }
        sleep(delay = 0) {
            const cb = () => {
                setTimeout(() => {
                    log(`sleeping ${delay} s`);
                    this.next();
                }, delay * 1000);
            };
            this.taskQueue.push(cb);
            return this;
        }
        sleepFirst(delay) {
            const cb = () => {
                setTimeout(() => {
                    log(`sleepFirst ${delay} s`);
                    this.next();
                }, delay * 1000);
            };
            this.taskQueue.unshift(cb);
            return this;
        }
    }
    return new MyLazyMan(name);
}
```

