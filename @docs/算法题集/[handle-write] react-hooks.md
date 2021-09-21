## 手写一个简单的React useState & useEffect

> 强烈推荐 >>> 具体可参考：https://codesandbox.io/s/50ww35vkzl?file=/src/index.js

### 代码

```js
// 目标组件中当前hook的索引
let _cursor = 0;
// 目标组件中所有hooks的存储对象，React中实际挂载在FiberNode中的 fiber.memorizedState._hooks 下
const _hooks = [];

/**
 * 手写React的useEffect实现polyfill
 * Tips: 已在门店歇业页面得到验证
 * @param {Function} cb 回调
 * @param {Array|undefined} deps 依赖项
 */
function useEffect(cb, deps) {
    if (deps && !Array.isArray(deps)) {
        throw Error('deps must be an array');
    }
    const hook = _hooks[_cursor] = _hooks[_cursor] || {};
    hook.memorizedState = hook.memorizedState || [];
    const noDeps = !deps;
    const lastDeps = hook.memorizedState;

    /* 判断当前deps与前一次依赖是否有区别 */
    const hasDiff = () => {
        for (let i = 0; i < deps.length; i++) {
            if (deps[i] !== lastDeps[i]) {
                return true;
            }
        }
        return false;
    };

    if (noDeps || hasDiff()) {
        hook.memorizedState = deps;
        cb();
    }
    _cursor++;
}

function useState(initVal) {
    const hook = _hooks[_cursor] = _hooks[_cursor] || {};;
    hook.memorizedState = hook.memorizedState || initVal;
    const update = (newVal) => {
        hook.memorizedState = newVal;
        /* dispatch React render methods: todo: */
    };
    _cursor++;
    return [hook.memorizedState, update];
}
```

**说明：**

1. `cursor`游标，实际由`FiberNode`节点来维护，并且在每一次渲染开始前要重置为0.
2. 这里的`useState`和`useEffect`方法的简单实现，纯粹就是`React`中设计思想的一种体现，并不能完全替代`React`提供的官方方法。
3. `hooks`作为链表形式的数据结构，是和当前组件节点挂钩的，**内敛性**比较强，是依托于`React`库的存在。

### 测试

已在vgt-owner项目中门店歇业页面简单的测试通过。
