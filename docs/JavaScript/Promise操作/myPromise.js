class MyPromise {
  constructor(fn) {
    this.status = 'pending';
    this.value = null;
    this.handlers = {};
    fn(this.resolve, this.reject);
  }

  resolve = (value) => {
    if (this.status === 'pending') {
      this.status = 'fulfilled';

      this.value = value;
      this.next(this.handlers);
    }
  };

  reject = (err) => {
    if (this.status === 'pending') {
      this.status = 'rejected';
      this.value = err;
      this.next(this.handlers);
    }
  };

  next = ({resolve, reject}) => {
    switch (this.status) {
      case 'fulfilled':
        resolve && resolve(this.value);
        break;
      case 'rejected':
        reject && reject(this.value);
        break;
      case 'pending':
        this.handlers = {resolve, reject};
    }
  };

  then = (success, fail) => {
    return new MyPromise((nextResolve, nextReject) => {
      this.next({
        resolve: (value) => {
          nextResolve(success(value));
        },
        reject: (err) => {
          nextReject(fail(err));
        },
      });
    });
  };
}

let p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(5);
  });
  console.log(666666);
});

p = p.then((res) => {
  console.log(res);
  return 7;
});

console.log('any code ');

p.then((res) => {
  console.log(res);
});
