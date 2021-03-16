function promiseAll(promiseArr) {
  if (!Array.isArray(promiseArr)) {
    throw new Error('not a array');
  }
  return new Promise((resolve, reject) => {
    let result = [];
    let count = 0;
    const len = promiseArr.length;
    for (let i = 0; i < len; i++) {
      // promiseArr 可以是一个非promise，使用Promise.resolve 直接返回一个resolve的promise
      Promise.resolve(promiseArr[i])
        .then((value) => {
          count++;
          result[i] = value; // 保证promise 结果有序
          if (count === length) {
            resolve(result);
          }
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}
