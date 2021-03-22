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

let tasks = [p(100), p(802), p(103), p(305), p(107), p(108), p(109)];

// 按执行结果顺序
function limitPromiseByResult(tasks, pool = 5) {
  let results = [];
  let index = 0;
  let tasks_bak = [...tasks];
  let together = tasks_bak.splice(0, pool).map((task, i) => {
    return task().then((res) => {
      results[index++] = res;
      return i;
    });
  });

  let p = Promise.race(together);
  for (let i = 0; i < tasks_bak.length; i++) {
    p = p.then((togetherIndex) => {
      together[togetherIndex] = tasks_bak[i]().then((res) => {
        results[index++] = res;
        return togetherIndex;
      });
    });
  }

  return Promise.all(together).then(
    () => results,
    (err) => Promise.reject(err)
  );
}

// 按执行任务顺序

function limitPromise(tasks, pool = 5) {
  let results = [];
  let index = pool;
  let tasks_bak = [...tasks];
  let together = tasks_bak.splice(0, pool).map((task, i) => {
    return task().then((res) => {
      results[i] = res;
      return i;
    });
  });

  //   return Promise.all(together).then(
  //     () => results,
  //     (err) => Promise.reject(err)
  //   );

  let p = Promise.race(together);
  for (; index < tasks.length; index++) {
    p = p.then((togetherIndex) => {
      together[togetherIndex] = tasks[index]().then((res) => {
        results[index] = res;
        return togetherIndex;
      });
      return Promise.race(together);
    });
  }

  return Promise.all(together).then(
    () => results,
    (err) => Promise.reject(err)
  );
}

limitPromiseByResult(tasks, 2).then(console.log).catch(console.log);
