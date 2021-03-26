let state = [];
let index = 0;
const myUseCallback = (callback, dependencies) => {
  if (state[index]) {
    let [cb, deps] = state[index];
    let hasChange = dependencies.some((d, i) => d !== deps[i]);

    if (hasChange) {
      state[index++] = [callback, dependencies];
      return callback;
    } else {
      index++;
      return cb; // 依赖没有改变，返回原来的函数
    }
  } else {
    state[index++] = [callback, dependencies];
    return callback;
  }
};
