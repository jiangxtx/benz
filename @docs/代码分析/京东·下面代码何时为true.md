## 京东·下面代码中 a 在什么情况下会打印 1？

```js
var a = ?;
if(a == 1 && a == 2 && a == 3) {
  console.log(1);
}
```

### 答案

主要有以下几种思路：

1. `toString`或者`valueOf`方法重写
2. 通过`defineProperty`中`get`方法劫持
3. 篡改`Array`的默认`join`方法

```js
/* Method 1: */
var a = {
  i: 1,
  toString() {
    return this.i;
  },
  valueOf() {
    return this.i++;
  },
};

if (a == 1 && a == 2 && a == 3) {
  console.log('Wa ok, get creazy a!');
}

/* Method 2: */
var a = {
  i: 1,
  toString() {
    return this.i++;
  },
};

if (a == 1 && a == 2 && a == 3) {
  console.log('Wa ok, get creazy a!');
}

/* Method 3: 非常鸡贼、非常讨技巧的写法！ */
var a = [1,2,3];
a.join = a.shift;

if (a == 1 && a == 2 && a == 3) {
  console.log('Wa ok, get creazy a!');
}

```

