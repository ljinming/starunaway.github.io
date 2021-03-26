let DEPS = [];
let clearCallbacks = [];
let index = 0;
const myUseEffect = (callback, dependence) => {
  const curDeps = DEPS[index];
  const hasChange =
    !curDeps || // 首次渲染，
    !dependence || //不传依赖，每次都要触发
    dependence.some((dep, i) => dep !== DEPS[i]); // 依赖发生了变化
  if (hasChange) {
    DEPS[index] = dependence;
    if (clearCallbacks[index]) {
      clearCallbacks[index]();
    }
    clearCallbacks[index] = callback();
  }
  index++;
};
