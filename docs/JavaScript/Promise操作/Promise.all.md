# Promise.all

```js
function promiseAll(args) {
  return new Promise(async (resolve, reject) => {
    const result = [];
    console.log(args);
    for (let i = 0; i < args.length; i++) {
      try {
        // 这里需要等待
        let value = await args[i];
        result.push(value);
        console.log(result);
      } catch (e) {
        reject(e);
      }
    }
    resolve(result);
  });
}
```

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    let resultCount = 0;
    let results = new Array(promises.length);

    for (let i = 0; i < promises.length; i++) {
      // 所有的异步一起跑，每一个跑完看看结果是否全了
      promises[i].then(
        (value) => {
          resultCount++;
          results[i] = value;
          if (resultCount === promises.length) {
            return resolve(results);
          }
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}
```
