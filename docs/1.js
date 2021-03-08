function inherit(subClass, superClass) {
  const _prototype = Object.create(superClass.prototype); // 创建父类原型的副本
  _prototype.constructor = subClass; // 把子类的构造函数找回来
  subClass.prototype = _prototype; // 更新子类的原型
}

function Sub(name) {
  this.name = name;
  this.names = [name];
}

Sub.prototype.saySubName = function () {
  console.log(this.name + 'Sub');
};

function Super(name) {
  this.name = name;
  this.names = name;
}

Super.prototype.saySuperName = function () {
  console.log(this.name + 'Super');
};

function F() {}
F.prototype = Super.prototype;
Sub.prototype = new F();
Sub.prototype.constructor = Sub;

inherit(Sub, Super);

Sub.prototype.sayName = function () {
  console.log('after inherit');
};
const a = new Sub('a');
a.names.push('aaaaa');
const b = new Sub('b');

console.log(a, b);
