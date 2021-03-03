# 防抖和节流

## 为什么需要防抖和节流

浏览器事件需要在一定的时间后触发，或者取消触发一些不必要的事件处理逻辑，或者减少网络请求次数，可以通过防抖和节流进行优化。
举一个小例子，在浏览器中按`F12`，在控制台中输入页面滚动的事件监听：

```js
function scroll(e) {
  console.log(e);
}
window.addEventListener('scroll', scroll);
```

鼠标滚轮轻轻滑动一下，可以看到监听到了十几次事件：

![scroll event](./scroll.png)  
如果每次事件都需要触发制定的逻辑，会带来极大的性能开销，后果就是浏览器太卡了！！

## debounce

如果想在滚动完成后才触发一次事件，可以通过防抖来解决：

```js
// debounce
function debounce(func, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(func, delay);
  };
}
```

这时通过防抖函数处理滚动事件：

```js
window.addEventListener('scroll', debounce(scroll, 3000));
```

会发现滚动事件在鼠标停在滚动 3 秒后才触发

### 防抖总结

防抖应对的场景是：对连续触发的事件，只希望在最后一次触发事件后才执行相应的事件处理函数

## throttle

如果页面连续滚动 10 秒钟，使用防抖进行优化，那用户必须得等待 NNNNNN 久才能获得事件处理结果。如果鼠标滚轮滚过来滚过去，岂不是永远也得不到事件处理结果了？那还不如卡顿呢！
所以需要一种方法，让事件每隔一定的时间久触发一次，这就是节流了。
顾名思义，节流就是节约流量，细水长流嘛。上代码

```js
// throttle
function throttle(func, delay) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func(...args);
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}
function scroll(e) {
  console.log(e);
}
window.addEventListener('scroll', throttle(scroll, 3000));
```

可以看到，随着鼠标动来动去，`log`会每隔 3 秒输出一次

### 节流总结

节流应对的场景是：对连续触发的事件，希望一定时间内事件只触发一次

## 完整的防抖和节流函数

### 防抖

```js
// debounce
function debounce(func, delay, firstToggle) {
  let timer = null;
  const debounced = function (...args) {
    const _this = this;
    if (timer) {
      clearTimeout(timer);
    }
    if (firstToggle) {
      const execute = !timer;

      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, delay);

      if (execute) {
        func.call(_this, ...args);
      }
    } else {
      timer = setTimeout(() => {
        func.call(_this, ...args);
      }, delay);
    }
  };

  debounced.remove = function () {
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
}
```

### 节流

还是采用时间戳版本，定时器版本有问题：
每次执行会记录上一次的执行时间，如果两次高频事件流的触发间隔较长(先疯狂滚动，歇一会再疯狂滚动)，会在第二次事件流触发的时候立即执行一次，原因是距离上一次的执行时间远远大于`delay`

```js
// throttle
function throttle(func, delay) {
  let timer = null;
  return function (...args) {
    const _this = this;
    if (!timer) {
      timer = setTimeout(() => {
        func.call(_this, ...args);
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}
```

节流和防抖函数中的`_this`,在执行时是调用 `throttle` 或 `debounce` 的上下文，指向执行的环境
