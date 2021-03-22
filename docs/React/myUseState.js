let state = [];
let index = 0;

const useState = (initialValue) => {
  let currentIndex = index;

  state[currentIndex] = state[currentIndex] === undefined ? initialValue : state[currentIndex];

  const setValue = (newValue) => {
    state[currentIndex] = newValue;
    render();
  };

  index++;

  return [state[currentIndex], setValue];
};

//  每次执行render的时候，所有的function component 会重新执行一遍，useState 会从头 按顺序执行一遍
// 所以禁止 if 里面 useState
const render = () => {
  index = 0;
  ReactDom.render(<App />, ele);
};
