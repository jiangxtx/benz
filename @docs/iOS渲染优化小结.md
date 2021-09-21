## 背景

`ios`手机页面渲染，一些首屏图片渲染的时机，在`js`解析执行之后才渲染，这样导致用户体验非常差。

据观察，是`ios内核`, 某些行为阻塞了图片的渲染；

## 原因：未知

## 解决方案

三步指导方案：

1. 把首屏渲染慢的图片，利用`link` + `prelaod` 提前加载
2. 然后图片的实现，由`img`标签改为`background-image`实现
3. 最后`js`脚本的加载，放在页面的下一个动画帧加载，最终可以达到一个比较好的效果

**具体实现：**

link preload实现；对应静态图片，直接代码写死，接口请求的动态图片，可以把前一次请求的图片缓存在内存，下次一次请求的时候在preload，如果运营不经常换图的话，效果比较好；

图片渲染改为background-image

脚本加载控制在下一个动画帧加载，具体实现代码如下：

```js
/**
 * // 把这个脚本插入页面，把资源传入scriptDelayLoad，调用即可
 * @param {*} sources
 */
function scriptDelayLoad(sources) {
  /**
   * js编程方式实现脚本的加载
   */
  const loadScript = (sources = []) => {
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < sources.length; i++) {
      const s = document.createElement('script')
      s.src = sources[i]
      s.crossOrigin = 'anonymous'
      fragment.appendChild(s)
    }
    document.body.appendChild(fragment)
  }

  const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || setTimeout
  raf(function () {
    loadScript(sources)
  })
}
```

 

