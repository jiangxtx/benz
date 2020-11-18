# benz

A collection of most common Utils, UIs, Componets, and so on. Aim to abstract codes away from the business in your projects.

## Why named "benz"

It comes from "Mercedes-Benz", aiming to be higher, swifter, and stronger. This is its Persuit.

## lodash-lite

`utils/lodash-lite`库，旨在替代`lodash`库中最最常用的几个功能。

**背景：**实际项目使用中，发现`lodash`中使用频率最高的往往就那么几个方法，但是却为此引入了整个`lodash`库，有点得不偿失。

为什么不通过`Tree-shaking`方法来引用`lodash`呢？

好问题！通过`import {get, throttle} from 'lodash';`这样的书写，并加以`Tree-shaking`相关配置，的确能够达到`lodash`瘦身的效果。**但是**，这种很容易出锅！一方面在于：总有同学一不小心就会写成`import _ from 'lodash';`这样的书写方式，从而无形中又把`lodash`整个库给打包进来了；另一方面在于：还有部分开发者偏爱`import throttle from 'lodash/throttle';`这样引用的，看似单独引入了包，但很容易造成`lodash`版本不一致的BUG。

一言蔽之，处处都是坑啊。基于此，方才封装了最最常用的几个函数（不会超出一只手指头的数量），即能满足超过`90%`的日常`lodash`需求。
