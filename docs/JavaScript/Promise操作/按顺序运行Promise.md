# 按顺序运行 Promise

```js
function runPromiseSequenceByReduce([firstPromise, ...others]) {
  return (...args) => others.reduce((cur, next) => cur.then(next), firstPromise(...args));
}

function runPromiseSequenceByFor([firstPromise, ...others]) {
  return (...args) => {
    let res = firstPromise(...args);
    for (let i = 0; i < others.length; i++) {
      res = res.then(others[i]);
    }
    return res;
  };
}
```
