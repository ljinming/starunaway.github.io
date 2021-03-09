function createStore(reducer) {
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
