function MyPromise(executor) {
  this.status = 'pending';
  this.value = null;
  this.reason = null;

  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  let self = this;

  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'fulfilled';
      self.value = value;
      self.onFulfilledCallbacks.forEach((cb) => cb(value));
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected';
      self.reason = reason;
      self.onRejectedCallbacks.forEach((cb) => cb(reason));
    }
  }

  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === 'function'
      ? onFulfilled
      : function (data) {
          resolve(data);
        };

  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : function (data) {
          //   reject(data);
          throw new Error(data);
        };

  let self = this;

  if (self.status === 'fulfilled') {
    return new MyPromise((resolve, reject) => {
      try {
        let x = onFulfilled(self.value);
        x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
      } catch (err) {
        reject(err);
      }
    });
  }

  if (self.status === 'rejected') {
    return new MyPromise((resolve, reject) => {
      try {
        let x = onRejected(self.value);
        x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
      } catch (err) {
        reject(err);
      }
    });
  }

  if (self.status === 'pending') {
    return new MyPromise((resolve, reject) => {
      self.onFulfilledCallbacks.push(() => {
        let x = onFulfilled(self.value);
        x instanceof MyPromise ? x.then(resolve, reject) : resolve(x);
      });
      self.onRejectedCallbacks.push(() => {
        let x = onRejected(self.value);
        x instanceof MyPromise ? x.then(resolve, reject) : reject(x);
      });
    });
  }
};

let d = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('666');
  }, 1000);
});

d.then((data) => {
  console.log(data);
  return 55;
}).then((d) => {
  console.log('then 2', d);
});
