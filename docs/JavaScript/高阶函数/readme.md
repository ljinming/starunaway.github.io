# 高阶函数

高阶函数是操作其他函数的函数，讲人话就是，函数的参数类型或函数返回值的类型是一个函数。把函数当成变量使用(函数是一等公民)

## 函数作为参数

最常见的用法就是数组原型上的方法了，常见的有 `Array.prototype.filter` `Array.prototype.map` `Array.prototype.forEach` `Array.prototype.some` `Array.prototype.reduce` 等。
还有就是令人深恶痛绝的回调地狱，将一个函数以参数的形式传给另一个函数，在需要的时候进行调用

## 函数作为返回值

在[`数据类型判断`](JavaScript/变量声明及数据类型/readme.md#objectprototypetostringcall推荐)中，推荐使用以下方法进行判断:

```js
const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';
const isArray = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
```

但是出现了好多重复的代码，可以利用高阶函数的特性返回一个函数

```js
const isType = (type) => (obj) => {
  return Object.prototype.toString.call(obj) === '[object ' + type + ']';
};

isType('String')('123'); // true
isType('Array')([1, 2, 3]); // true
```

同样，在处理 DOM 事件的时候，可能想要传递一些参数，也可以利用高阶函数的特性

```js
// react
function Component(){
	const handleClick = (param)=>(event)=>{...}
	return <button onClick=(handleClick(param))>click</button>
}
```

`click`事件触发的时候，实际上是调用的 `handleClick()`执行后的函数.当然，也可以使用[惰性函数实现](JavaScript/LazyFunction/readme.md#惰性函数)

另外，[防抖](JavaScript/防抖和节流/readme.md#debounce)和[节流](JavaScript/防抖和节流/readme.md#throttle)也用到了使用高阶函数返回一个新函数的特性

### 来个题目

数组扁平化去重

```js
Array.prototype.myFlat = function () {
  return [].concat(...this.map((item) => (Array.isArray(item) ? item.myFlat() : item)));
};

Array.prototype.unique = function () {
  return [...new Set(this)];
};

var old_arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];
console.log(
  old_arr
    .myFlat()
    .unique()
    .sort((a, b) => a - b)
);
```

## 函数柯里化

实现目标是*把函数参数保留起来，当函数的参数达到一定数量时，执行函数*

```js
const curry = (fn) => (fn1 = (...args) => (args.length >= fn.length ? fn(...args) : (...arg) => fn1(...args, ...arg)));
```
