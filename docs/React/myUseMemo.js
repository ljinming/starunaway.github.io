let state = [];
let index = 0;
const myUseCallback = (callback, dependencies) => {
  if (state[index]) {
    let [cb_value, deps] = state[index];
    let hasChange = dependencies.some((d, i) => d !== deps[i]);

    if (hasChange) {
      state[index++] = [callback(), dependencies];
      return callback();
    } else {
      index++;
      return cb_value; //
    }
  } else {
    state[index++] = [callback(), dependencies];
    return callback(); // 类似useCallBack，返回的是函数的执行结果
  }
};
