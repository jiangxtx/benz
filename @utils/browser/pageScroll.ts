import { getCurrentPlatform, SYSTEM } from '@benz/platform-util';
// @ts-ignore
import {
    disableScroll,
    enableScroll
} from '@benz/core-util';

let sp = 0;

function fixBodyPosition () {
    const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
    sp = scrollTop;
    document.body.style.top = -1 * scrollTop + 'px';
    document.body.style.position = 'fixed';
}

function releaseBodyPosition () {
    document.body.style.overflow = '';
    document.body.style.position = null;
    document.body.style.top = null;
    window.scrollTo(0, sp);
}

/**
 * 禁止当前页面滚动
 */
export function disablePageScroll() {
    getCurrentPlatform().system !== SYSTEM.IOS && fixBodyPosition();
    const dom = document.querySelectorAll('.need-scroll');
    // @ts-ignore
    disableScroll(dom.length > 1 ? Array.from(dom) : dom[0]);
}

/**
 * 释放当前页面的滚动能力
 */
export function enablePageScroll() {
    getCurrentPlatform().system !== SYSTEM.IOS && releaseBodyPosition();
    enableScroll();
}
