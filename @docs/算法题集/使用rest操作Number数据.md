# 题目

【编程】对Number可使用 ... 操作，并且输出结果如下：
 * `[...5] -> [0,1,2,3,4,5]`
 * `[...12] -> [0,1,2,3,4,5,6,7,8,9,10,11,12]`

# 解法

```js
/* Method 1 */
Number.prototype[Symbol.iterator_1] = function* () {
    /* Method 1: */
    // for (let i = 0; i <= this; i++) {
    //     yield i;
    // }

    /* Method 2: */
    let i = -1;
    while (++i <= this) {
        yield i;
    }
}
```

```js
/* Method 2 */
Number.prototype[Symbol.iterator] = function () {
    const num = this
    let count = -1
    return {
        next() {
            count++;
            const done = count > num;
            return {
                done,
                value: done ? undefined : count,
            }
        }
    }
}
```
