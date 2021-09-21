## 题目背景：（携程）算法手写题

已知如下数组：`var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];` 编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组。

**解题思路：**

可分为三大步骤来接此题：

1. 先实现数组的扁平化处理 flatten();
2. 再进行数组去重处理 unique();
3. 最后进行排序处理 sort();

下面就只需要依次实现这三个函数即可。其中，Array 自带排序方法sort()。

### 数组去重

```js
/**
 * 数组去重
 * @param arr
 */
function unique(arr) {
    if (!Array.isArray(arr)) {
        return arr;
    }

    return [...new Set(arr)];
}
```

### 扁平化处理flatten

**方法一：** 递归法实现

优点：属于稳定扁平化处理，不会改变原始数组中各个元素的相对顺序。

缺点：性能开销相对较大，容易造成栈溢出问题。

```js
/**
 * 递归法实现数组flatten
 * @param arr 原始数组
 * @param list 最终数值的缓存器
 */
function flatten(arr, list) {
    list = list || [];
    if (Array.isArray(arr)) {
        arr.forEach(item => {
            flatten(item, list);
        });
    } else {
        list.push(arr);
    }
    return list;
}
```

递归的另一种版本：

```js
function flatten(arr) {
  if (!Array.isArray(arr)) return [arr];
  return arr.reduce((pre, cur) => {
    if (!Array.isArray(cur)) {
      pre.push(cur);
    } else {
      pre.push(...flatten(cur));
    }
    return pre;
  }, []);
}
```


**方法二：** 循环法实现

优点：速度快，性能好。

缺点：属于不稳定的扁平化处理，可能会改变原始数组中各个元素的相对顺序。

```js
/**
 * 循环法实现数组flatten
 * var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
 * @param arr
 */
function flatten(arr) {
    const queue = []; // 待循环数组队列
    const list = []; // 容纳最终的数值
    
    if (!Array.isArray(arr)) {
        return arr;
    }

    queue.unshift(arr);
    while (queue.length > 0) {
        const tmp = queue.pop();
        tmp.forEach(item => {
            if (Array.isArray(item)) {
                queue.unshift(item);
            } else {
                list.push(item);
            }
        });
    }
    return list;
}
```

**方法三：** 递归迭代法实现，支持迭代层级设置【from MDN】

思想和方法一类似。

```js
function flatten(arr, depth = 1) {
  if (!Array.isArray(arr)) {
    return arr;
  }

  if (depth === 0) {
    return arr.slice();
  }

  return arr.reduce((acc, cur) => {
    return acc.concat(Array.isArray(cur) ? flatten(cur, depth - 1) : cur);
  }, []);
}
```

**方法四：** Use a Stack【from MDN】

refer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat

和自己写的方法二思想是一样的，但是细节的把控与处理，还是MDN更加牛掰！好好体会一下~~

```js
// non recursive flatten deep using a stack
// note that depth control is hard/inefficient as we will need to tag EACH value with its own depth
// also possible w/o reversing on shift/unshift, but array OPs on the end tends to be faster
function flatten(input) {
  const stack = [...input];
  const res = [];
  while(stack.length) {
    // pop value from stack
    const next = stack.pop();
    if(Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  // reverse to restore input order
  return res.reverse();
}
```

**方法五：** Use Generator Function【from MDN】

此法，新天下耳目哉！

```js
function* flatten(array, depth) {
    if(depth === undefined) {
      depth = 1;
    }
    for(const item of array) {
        if(Array.isArray(item) && depth > 0) {
          yield* flatten(item, depth - 1);
        } else {
          yield item;
        }
    }
}

const arr = [1, 2, [3, 4, [5, 6]]];
const flattened = [...flatten(arr, Infinity)];
// [1, 2, 3, 4, 5, 6]
```

**方法六：** ES6书写方式

也是通过循环法，结合`ES6`的`array.some`来巧妙的实现该功能。

不过，缺陷也明显，那就是效率比较低下。

```js
function flatten(array) {
    while(array.some(item => Array.isArray(item)))
    array = [].concat(...array);
    return array
}
```

