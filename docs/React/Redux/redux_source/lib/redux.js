export function createStore(reducer) {
  let state = reducer(undefined, {
    type: '@@redux/init',
  });

  const listeners = [];

  function dispatch(action) {
    const newState = reducer(state, action);
    state = newState;
    listeners.forEach((fn) => fn());
  }
  function subscribe(fn) {
    listeners.push(fn);
  }
  function getState() {
    return state;
  }

  return {
    dispatch,
    subscribe,
    getState,
  };
}

export function combineReducers(reducers) {
  return (state = {}, action) => {
    const newState = {};
    Object.keys(reducers).forEach((key) => {
      newState[key] = reducers[key](state[key], action);
    });
    return newState;
  };
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return (args) => args;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((curFun, nextFun) => (...args) => curFun(nextFun(...args)));
}
