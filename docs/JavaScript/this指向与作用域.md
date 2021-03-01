```js
setTimeout(function () {
  console.log(this); // 计时器里面的this默认指向window;
}, 1000);
```

保存 this

```js
setTimeout(
  function () {
    console.log(this);
  }.bind(this),
  1000
);
```

或者使用箭头函数

```js
setTimeout(() => {
  console.log(this);
}, 1000);
```
