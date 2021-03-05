# 单例模式

单例模式保证类的实例只有一个，后续使用时，确保都是首次创建的实例

## 在构造函数中拦截并返回 this

```js
const singleInstance = () => {
  let instance;
  return (ins) => {
    if (!instance) {
      instance = ins;
      return;
    }
    return instance;
  };
};

const singleTest = singleInstance();

function A() {
  const _instance = singleTest(this);
  if (_instance) {
    return _instance;
  }

  this.name = '333';
}

A.prototype.is = 1;
const a1 = new A();
A.prototype.b = 2;
const a2 = new A();
console.log(a1, a2, a1 === a2);
console.log(a1.is, a1.b);
console.log(a2.is, a2.b);
```

实际上是这种逻辑

```js
function Un() {
  //   let _instance = this;

  if (Un._instance) {
    return Un._instance;
  }

  this.u = 999;

  Un._instance = this;
}

Un.prototype.is = 1;

const u1 = new Un();
Un.prototype.t = 8;

const u2 = new Un();
console.log(u1, u2, u1 === u2);
console.log(u1.is, u1.t);
console.log(u2.is, u2.t);
```

高级的抽象

```js
const getSingle = function (fn) {
  var result;
  return function (...args) {
    return result || (result = fn.call(this, ...args));
  };
};
```

## 重写构造函数

```js
function A(name) {
  let instance = this;
  this.name = name;
  console.log(this);

  //重写构造函数
  A = function () {
    return instance;
  };

  // 指向旧的原型，防止更改原型链时，后来者不能正确的获取原型链上的属性
  A.prototype = this.constructor.prototype;

  return instance;
}
A.prototype.pro1 = 'from protptype1';
let a1 = new A();
A.prototype.pro2 = 'from protptype2';

let a2 = new A();

console.log(a1, a2, a1 === a2);
console.log(a1.constructor === a2.constructor);

console.log(a1.pro1, a1.pro2);
console.log(a1.pro1, a2.pro2);
```

## 总结

单例模式下，构造函数在第一次执行时的参数有效，之后的 `new`操作符返回的都是第一次的结果
