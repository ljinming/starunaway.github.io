function Tom() {
  class LazyMan {
    constructor() {
      this.tasks = [];
      setTimeout(() => {
        this.next();
      }, 0);
    }

    eat = (value) => {
      const fn = () => {
        console.log(value);
        this.next();
      };
      this.tasks.push(fn);
      return this;
    };

    sleepFist = (time) => {
      const fn = () => {
        setTimeout(() => {
          console.log('sleepFist', time);
          this.next();
        }, time);
      };
      this.tasks.unshift(fn);
      return this;
    };

    sleep = (time) => {
      const fn = () =>
        setTimeout(() => {
          console.log('sleep ' + time);
          this.next();
        });
      this.tasks.push(fn);
      return this;
    };

    next = () => {
      let fn = this.tasks.shift();
      fn && fn();
    };
  }

  return new LazyMan();
}

Tom().eat('早饭').sleep(3000).eat('午饭').sleepFist('2000');
