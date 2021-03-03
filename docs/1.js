const curry = (fn) => (fn1 = (...args) => (args.length >= fn.length ? fn(...args) : (...arg) => fn1(...args, ...arg)));
