const delay = function (interval) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(interval);
    }, interval);
  });
};
const p = (t) => () => {
  return delay(t);
};

let tasks = [p(100), p(103), p(803), p(305), p(107), p(108), p(109)];

function limitPromise(tasks, pool = 5) {
  let results = [];
  let index = 0;
  let limitPromises = Array(pool)
    .fill(null)
    .map(() => {
      return new Promise((resolve, reject) => {
        const run = () => {
          if (index >= tasks.length) {
            resolve();
            return;
          }
          let old_index = index;
          tasks[index++]()
            .then((res) => {
              results[old_index] = res;
              run();
            })
            .catch(reject);
        };
        run();
      });
    });

  return Promise.all(limitPromises).then(
    () => results,
    (err) => Promise.reject(err)
  );
}

limitPromise(tasks, 2).then(console.log).catch(console.log);
