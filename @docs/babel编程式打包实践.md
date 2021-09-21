## 序言

习惯了通过webpack配置脚本等操作来进行打包构建，你熟悉通过编程的方式，来对源码进行打包构建吗？

## 用terser压缩源码

`terser`库用来压缩代码，A JavaScript parser and mangler/compressor toolkit for ES6+.

**为什么使用terser?** 

Because `uglify-es` is no longer maintained and `uglify-js` does not support ES6+.

### 编程式压缩

所谓的编程式压缩，就是指像书写`JS`代码一样，通过编程的方式来运行代码，继而得到压缩文件。这在平日的开发中并不常见，因为基本上都是采用脚本式配置，然后通过诸如 webpack 这样的打包工具压缩的。

剑出偏锋。所以，我们就先从“编程式压缩”讲起。直接上代码：

```js
const terser = require('terser');
/* 一段基于E6编写的源码 */
const src = `
    function pick(flag) {
        const name = '';
        if(flag) {
            name = 'jack';
        } else {
            name = 'ipad jack';
        }
        console.log(name);
        return name;
    }
`;
console.log('terser: ', terser.minify(src));
```

我们的目标就是把我们开发时的`pick()`方法进行压缩打包，继而得到`production`模式的代码。
在node中运行后，可得到输出结果为：
> terser:  {
>   code: 'function pick(c){const n="";return n=c?"jack":"ipad jack",console.log(n),n}'
> }

可以看出来，被压缩的很彻底，很符合预期。

> **TIPS：**上面代码压缩固然彻底，但是也可以看出来，`const`并没有被转化为`var`，即`ES6`的代码风格并没有转为`ES5`。这样还是无法直接部署到线上的，毕竟，兼容性很是一大考验。那怎么办呢？别急！稍后，`@babel`就要隆重登场了……

### 配置式压缩

具体不表。

## babel利器

还是用上面的那段`src`源码来演示，看看经过`babel`编译后会得到什么。

```js
const babel = require('@babel/core');
/* 一段基于E6编写的源码 */
const src = `
    function pick(flag) {
        const name = '';
        if(flag) {
            name = 'jack';
        } else {
            name = 'ipad jack';
        }
        console.log(name);
        return name;
    }
`;
console.log('formed: \n', babel.transform(src).code);
```

输出结果为:

```text
formed: 
 function pick(flag) {
  const name = '';

  if (flag) {
    name = 'jack';
  } else {
    name = 'ipad jack';
  }

  console.log(name);
  return name;
}
```

竟然什么都没干？原封不动的把`src`给输出了。哦，不对，好像少了点什么？**babel配置！**

加上配置，再试一下：

```js
const babel = require('@babel/core');
/* 一段基于E6编写的源码 */
const src = `
    function pick(flag) {
        const name = '';
        if(flag) {
            name = 'jack';
        } else {
            name = 'ipad jack';
        }
        console.log(name);
        return name;
    }
`;
const options = {
    presets: [
        ['@babel/preset-env'],
    ]
    minified: false,
};
console.log('formed: \n', babel.transform(src, options).code);
```

加上配置后，现在的输出结果为：

```text
formed: 
 "use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function pick(flag) {
  var name = '';

  if (flag) {
    name = (_readOnlyError("name"), 'jack');
  } else {
    name = (_readOnlyError("name"), 'ipad jack');
  }

  console.log(name);
  return name;
}
```

可以看到，`const`已经被转化为`var`类型的`ES5`书写规范了。同时，还被`_readOnlyError`方法额外包装了一下，把代码错误也给暴露了出来。**点赞！**

## 编译Class类与@装饰器

```js
const babel = require('@babel/core');
const src = `
    function pick(flag) {
        const name = '';
        if(flag) {
            name = 'jack';
        } else {
            name = 'ipad jack';
        }
        console.log(name);
        return name;
    }

    function log(target, key, descriptor) {
        console.log('>>>preLog: ', +Date.now());
        return target;
    }

    class Person {
        constructor(name) {
            this.name = name;
        }
        @log
        sayHello() {
            console.log('sayHell::')
        }
        @log
        changeName(name) {
            this.name = name;
        }
    };
    const p1 = new Person('jack');
    const map = new Map();
    map.set('p1', p1);
`;
const options = {
    presets: [
        ['@babel/preset-env'],
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ],
    minified: false,
};
console.log('formed: \n', babel.transform(src, options).code);
```

输出结果为：

```text
formed: 
 "use strict";

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function pick(flag) {
  var name = '';

  if (flag) {
    name = (_readOnlyError("name"), 'jack');
  } else {
    name = (_readOnlyError("name"), 'ipad jack');
  }

  console.log(name);
  return name;
}

function log(target, key, descriptor) {
  console.log('>>>preLog: ', +Date.now());
  return target;
}

var Person = (_class =
/*#__PURE__*/
function () {
  function Person(name) {
    _classCallCheck(this, Person);

    this.name = name;
  }

  _createClass(Person, [{
    key: "sayHello",
    value: function sayHello() {
      console.log('sayHell::');
    }
  }, {
    key: "changeName",
    value: function changeName(name) {
      this.name = name;
    }
  }]);

  return Person;
}(), (_applyDecoratedDescriptor(_class.prototype, "sayHello", [log], Object.getOwnPropertyDescriptor(_class.prototype, "sayHello"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "changeName", [log], Object.getOwnPropertyDescriptor(_class.prototype, "changeName"), _class.prototype)), _class);
;
var p1 = new Person('jack');
var map = new Map();
map.set('p1', p1);
```

**小结：**

1. 这段编译后的代码是不是看着挺眼熟？那就对了，和我们webpack编译后的JS文件一样了（未压缩前）。实际上，扒开`node_modules`中第三方源码时，就会发现很多提供的源码都是类似这样的情形。
2. `_defineProperties()`，`_classCallCheck()`, `_createClass()`, `_applyDecoratedDescriptor`等方法，都是第三方库提供源码时，在开头经常声明的一些函数集。到这里才明白，原来是这样生成的。
3. `Class`被编译为了`Function`。
4. @装饰器通过`_applyDecoratedDescriptor`函数处理，本质上仍然是一种`wrapper`式的高阶包装。


### 装饰器@decorator

```js
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    let desc = {};
    Object.keys(descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;
    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }
    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);
    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer
            ? desc.initializer.call(context)
            : void 0;
        desc.initializer = undefined;
    }
    if (desc.initializer === void 0) {
        Object.defineProperty(target, property, desc);
        desc = null;
    }
    return desc;
}
```

