```js
Function.prototype.myCall = function (context, ...args) {
  const _context = context ? Object(context) : window;
  _context.fn = this;
  const result = _context.fn(...args);
  delete _context.fn;
  return result;
};

Function.prototype.myApply = function (context, args) {
  const _context = context ? Object(context) : window;
  _context.fn = this;
  const result = !args || args.length === 0 ? _context.fn() : _context.fn(...args);
  delete _context.fn;
  return result;
};

Function.prototype.myBind = function (context, ...args1) {
  const _this = this;
  return (...args2) => {
    const result = _this.apply(context, [...args1, ...args2]);
    return result;
  };
};

function myNew(Pro, ...args) {
  const obj = Object.create(Pro.prototype);
  // 这么写有性能问题，还会影响所有继承自obj的对象
  //   const obj = new Object();
  //   obj.__proto__ = Pro.prototype;
  const ret = Pro.apply(obj, args);
  return ret instanceof Object ? ret : obj;
}

function Person(a, b) {
  this.a = a;
  this.b = b;
}

let a = new Person(1, 2);
console.log(a);

let b = myNew(Person, 2, 3);
console.log(b);
```
