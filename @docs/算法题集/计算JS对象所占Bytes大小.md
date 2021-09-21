## 问题：如何计算一个JS对象所占用的内存大小?

### 1 先定义好各个基础类型所占用的字节数

```js
/* 不同基础类型变量所占的最小字节数 */
const TYPE_SIZE = {
  Number: 8,
  String: 2,
  Boolean: 4,
  Nil: 0,
  /* 指针占用字节数 */
  Pointer: 1,
};
```

### 2 


```js
/**
* 计算一个对象所占用的内存大小（单位为字节(Byte)）
* @param obj
*/
function sizeofObject(obj, set) {
  // 考虑Buffer情形
  if (Buffer.isBuffer(obj)) {
    return obj.length;
  }

  const type = typeof obj;
  if (obj == null) {
    return TYPE_SIZE.Nil;
  }
  if (type === 'boolean') {
    return TYPE_SIZE.Boolean;
  }
  if (type === 'number') {
    return TYPE_SIZE.Number;
  }
  if (type === 'string') {
      // 待考虑中文长度情形 TODO:
      return TYPE_SIZE.String * obj.length;
  }
  if (Array.isArray(obj)) {
      return obj.reduce((acc, cur) => acc + sizeofObject(cur, set), 0);
  }
  if (type === 'object') {
      return sizeofPlainObject(obj, set);
  }

  console.error('Error type checked: ' + type);
  return TYPE_SIZE.Nil;
}
```

### 3 计算plain Object占用空间

```js
/**
* 计算一个纯粹Object型对象的所占字节数
* 两个注意事项：
    1. 变量名key也占据存储空间
    2. 需校验是否为circular-object，否则会 Maximum call stack size exceeded
    3. 考虑Symbol类型
* @param obj
*/
function sizeofPlainObject(obj, set) {
  let size = 0;
  set.add(obj);
  for (const key in obj) {
    if(!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const value = obj[key];
    // 防止循环引用
    if (value != null && typeof value === 'object') {
      // 说明：命中该引用时，只能说明在object中该对象值被不同的key重复引用了，而不能说明object一定是circularObject.
      if (set.has(value)) {
        continue;
      }
      set.add(obj[key]);
    }
    
    // 量名也占据存储空间
    size += TYPE_SIZE.String * key.length;
    size += sizeofObject(value, set);
  }
  return size;
}
```

### 4 对外暴露的方法

```js
/**
 * 计算object对象所占用的内存Bytes
 * @param {*} object 
 * @returns 
 */
export function sizeof(object) {
  // 用来存储object内部各个key对应的plain-object，用于循环引用检测
  const set = new WeakSet();
  return sizeofObject(object, set);
}
```

### 5 测试

```js
/* TEST Codes */

console.log(sizeof(123));
console.log(sizeof('123'));
console.log(sizeof(false));
console.log(sizeof([false, 123, '123']));

const obj = {
  name: 'jackson',
  age: 251,
  hobby: [false, 123, '12345'],
  likes: { hobby: true }
};
obj.child = obj;
obj.likes.hobby = obj.likes;
console.log(sizeof(obj));
```

