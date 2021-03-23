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

function createRequest(tasks, pool, callback) {
  if (typeof pool === 'function') {
    callback = pool;
    pool = 5;
  }
  if (typeof pool !== 'number') {
    pool = 5;
  }

  if (typeof callback !== 'function') {
    callback = () => {};
  }

  class TaskQueue {
    running = 0;
    queue = [];
    results = [];
    pushTask(task) {
      let self = this;
      self.queue.push(task);
      self.next();
    }

    next() {
      let self = this;
      while (self.running < pool && self.queue.length) {
        self.running++;
        let task = self.queue.shift();
        task()
          .then((res) => {
            self.results.push(res);
          })
          .finally(() => {
            self.running--;
            self.next();
          });
      }

      if (self.running === 0) {
        callback(self.results);
      }
    }
  }

  let TQ = new TaskQueue();
  tasks.forEach((task) => TQ.pushTask(task));
}

createRequest(tasks, 2, (r) => console.log(r));

// limitPromise(tasks, 2).then(console.log).catch(console.log);
