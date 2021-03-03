# 惰性函数

惰性函数是函数会在第一次执行的时候，固定函数的执行分支。之后对函数的调用中，就不再重新走函数的分支判断了。

## 惰性函数的原理

直接上代码，假设有个记录程序启动时间的函数:

```js
let startTime = null;
function getTime() {
  if (!startTime) {
    startTime = new Date().getTime();
  }

  return startTime;
}

console.log(getTime());
console.log(getTime());
console.log(getTime());
```

这样做的坏处是 `startTime` 定义在了外部，可以被其他代码直接修改，可以使用立即执行函数构建函数闭包，解决变量污染：

```js
const getTime = (function () {
  let startTime = null;

  return function () {
    if (!startTime) {
      startTime = new Date().getTime();
    }
    return startTime;
  };
})();

console.log(getTime());
console.log(getTime());
console.log(getTime());
```

使用立即执行函数解决了变量污染的问题，但是每次执行的时候都需要走 `if` 进行判断，进行了额外的计算。通过惰性函数，可以只在第一次执行的时候进行一次判断，以后就不需要了:

```js
let getTime = function () {
  let startTime = null;

  if (!startTime) {
    startTime = new Date().getTime();
  }
  getTime = function () {
    return startTime;
  };
  return getTime();
};

console.log(getTime());
console.log(getTime());
console.log(getTime());
```

`getTime`在第一次执行的时候会重写函数本身，这样以后的每次执行都会**执行重写后的函数**，不再进行额外的分支判断了

## 惰性函数的应用

### 浏览器事件绑定

惰性函数可以用来解决浏览器兼容问题，比如在事件监听中：

```js
if (element.addEventListener) {
  element.addEventListener(type, fun, false);
} else if (element.attachEvent) {
  element.attachEvent('on' + type, fun);
}
```

可以修改成:

```js
let addEventListener = function (ele, type, func, capture) {
  if (ele.addEventListener) {
    addEventListener = function (ele, type, func, capture) {
      ele.addEventListener(type, func, capture);
    };
  } else if (ele.attachEvent) {
    addEventListener = function (ele, type, func) {
      ele.attachEvent('on' + type, function () {
        func.call(el);
      });
    };
  } else {
    addEventListener = function (ele, type, func) {
      ele['on' + type] = func;
    };
  }

  addEventListener(ele, type, func, capture);
};
```

这样每次执行`addEventListener`的时候就会根据当前浏览器环境执行制定的代码进行事件绑定

### 创建应用单列

```js
function Instance() {
  // 缓存的实例
  const inst = this;
  this.params = {...arguments};

  // 重写构造函数
  Instance = function () {
    return inst;
  };
}
```

## 总结

惰性函数主要的应用场景如下：

1. 初始化后在当前应用环境不再改变
2. 应用频繁，经常进行调用
3. 需要进行分支判断，规避环境差异
