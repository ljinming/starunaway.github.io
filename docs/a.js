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

function promiseAll(args) {
  return new Promise(async (resolve, reject) => {
    const result = [];
    console.log(args);
    for (let i = 0; i < args.length; i++) {
      try {
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

// promise function 1
function p1(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 5);
  });
}

// promise function 2
function p2(a) {
  return new Promise((resolve, reject) => {
    reject(a * 2);
  });
}

// function 3  - will be wrapped in a resolved promise by .then()
function f3(a) {
  return a * 3;
}

// promise function 4
function p4(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 4);
  });
}

const promiseArr = [p1, p2, f3, p4];
// runPromiseSequence1(promiseArr)(10).then(console.log); // 1200

promiseAll(promiseArr.map((p) => p(10))).then(console.log);
