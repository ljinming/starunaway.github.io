function limitLoad(urls, handler, limit) {
  const sequence = [...urls];
  let promises = [];

  limit = limit || Infinity;
  promises = sequence.splice(0, limit).map((url, index) => {
    return handler(url).then(() => {
      return index;
    });
  });

  let p = Promise.race(promises);
  for (let i = 0; i < sequence.length; i++) {
    p = p.then((res) => {
      promises[res] = handler(sequence[i]).then(() => res);
      return Promise.race(promises);
    });
  }
}

function promiseLink(promises) {
  if (!Array.isArray(promises)) {
    throw new Error('not array');
  }
  let p = promises[0]();

  for (let i = 1; i < promises.length; i++) {
    p = p.then((res) => {
      console.log(res);
      return promises[i]();
    });
  }

  return p;
}

function a1() {
  return new Promise((resolve, reject) => {
    resolve('a1');
  });
}

function a2() {
  return new Promise((resolve, reject) => {
    resolve('a2');
  });
}
function a3() {
  return new Promise((resolve, reject) => {
    resolve('a3');
  });
}

debugger;
promiseLink([a1, a2, a3]).then(console.log);

// ```js
// function runPromiseSequenceByReduce([firstPromise, ...others]) {
//   return (...args) => others.reduce((cur, next) => cur.then(next), firstPromise(...args));
// }

// function runPromiseSequenceByFor([firstPromise, ...others]) {
//   return (...args) => {
//     let res = firstPromise(...args);
//     for (let i = 0; i < others.length; i++) {
//       res = res.then(others[i]);
//     }
//     return res;
//   };
// }
// ```;
