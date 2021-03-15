// 时间戳 -> 第一次会立即执行
function throttle(fn, delay) {
  let last = 0;

  return function () {
    let now = Date.now();
    if (now - last > delay) {
      last = now;
      fn.apply(this, arguments);
    }
  };
}

// 定时器 -> 最后一次会延迟执行

function throttleTimer(fn, delay) {
  let timer = null;

  return function (...args) {
    let _this = this;
    if (!timer) {
      timer = setTimeout(function () {
        fn.apply(_this, args);
        clearTimeout(timer);
      }, delay);
    }
  };
}

// 优化版
function throttleBest(fn, delay) {
  let start = Date.now();
  let timer = null;
  return function (...args) {
    let _this = this;
    let curTime = Date.now();

    let remaining = delay - (curTime - start);
    // 每次清空定时器
    clearTimeout(timer);
    // 每次执行的时候看离下一次执行还有多少时间
    if (remaining > 0) {
      //如果还没到点，再丢一个定时器
      timer = setTimeout(function () {
        fn.apply(_this, args);
      }, remaining);
    } else {
      // 如果刚好过期了，得把这次的补上
      fn.apply(_this, args);
      start = Date.now();
    }
  };
}

const handle = () => {
  console.log(Math.random());
};

const tH = throttle(handle, 100);
setInterval(() => {
  tH();
}, 10);
