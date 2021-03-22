Function.prototype.before = function (callback) {
  if (!typeof callback === 'function') {
    throw new Error('no callback');
  }

  let _this = this;

  return function (...args) {
    callback.call(this, ...args);
    return _this.call(this, ...args);
  };
};

Function.prototype.after = function (callback) {
  if (!typeof callback === 'function') {
    throw new Error('no callback');
  }

  let _this = this;

  return function (...args) {
    let res = _this.call(this, ...args);
    callback.call(this, ...args);
    return res;
  };
};

let fun = function () {
  console.log('func');
};

fun.before(() => {
  console.log('before');
})();
