# 从零实现一个 redux

## store

我们使用使用`redux`时会使用 `react-redux`提供的 `Provider` 以及需要创建一个`store`

```js
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

先从基础来，假设需要创建一个`store`,有一个 `reducer` 如下：

```js
//reducer.js
function count(state = 1, action) {
  switch (action.type) {
    case 'increment':
      return state + action.data;
    case 'decrement':
      return state - action.data;
    default:
      return state;
  }
}
```

在 `store` 使用上述 `reducer`：

```js
// store.js
import {createStore} from 'redux';
import reducer from './reducer';
export default createStore(reducer);
```

我们知道，`store` 提供了 3 个主要的方法: `dispatch`,`subscribe`,`getState`

其中`getState`是获取当前的`state`,`subscribe`是订阅当前状态的变化，每次 `state`的值改变时，会触发`subscribe`的回调函数, `dispatch` 是发出一个 `action` 的方法，经常用到。

由上，一个简单的 `redux` 雏形就搭建起来了：
有一个 `createStore` 函数， 接收一个函数参数 `reducer`，返回一个包含 `dispatch`,`subscribe`,`getState`属性的对象。

用伪代码写一下：

```js
function createStore(reducer) {
  function dispatch() {}
  function subscribe() {}
  function getState() {}

  return {
    dispatch,
    subscribe,
    getState,
  };
}
```

分析一下，`subscribe`用来注册回调事件，肯定需要存储事件列表,`getState`需要返回一个`state`, 也就是需要一个变量存储数据。`dispatch`做的事情最多，需要执行`reducer()`函数，执行完成后，还需要触发`subscribe`注册过的事件，就是一个[发布订阅模式](JavaScript/发布订阅模式/readme.md)。接下来就完整的实现一下：

```js
//redux.js
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
```

这样一个简单的 `redux` 就实现了，当然，一些类型啊容错啊没有做。
解释一下，`state`是需要初始化的，可以直接调用 `reducer`,这个时候传递的是一个特殊的 `action`,这个特殊的 `type` 就是用来创建一个初始状态的 `state`。其实，打开调试器，每次初始化的时候`redux`的 `devTool`会记录一个特殊的`action`，就是它了

## Provider

有了 `store` ，需要在组件中使用它，这个容器组件就是 `Provider` 了。看它的使用方法，就是一个 `react` 组件嘛，一个简单的模型呼之欲出:

```js
class Provider extends React.Component {
  // 其他逻辑
  render() {
    const {children} = this.props;
    return children;
  }
}
```

`Provider`提供的 `store` 属性可以在所有的子组件种访问，这里使用了 `react` 的 [context](https://reactjs.org/docs/context.html),具体实现如下：

```js
// react-redux.js

import React from 'react';

const ProviderContext = React.createContext(null);

export class Provider extends React.Component {
  render() {
    const {children, store} = this.props;
    // console.log(children, store);
    return <ProviderContext.Provider value={{store}}>{children}</ProviderContext.Provider>;
  }
}
```

## connect

可以说 `connect` 是 `react-redux` 的核心了，每一个需要 `store` 的组件都需要 `connect` 包裹一层
`connect` 是一个高阶函数，通过接收 `mapState` 和 `mapDispatch` 向 `UI` 组件注入一些属性
先看一下我们在使用中的操作:

```js
class App extends Component {
  handleIncrement = () => {
    this.props.increment(1);
  };
  handleDecrement = () => {
    this.props.decrement(1);
  };

  render() {
    // UI
  }
}

const mapStateToProps = (state) => ({count: state.count});
const mapDispatchToProps = {
  increment: () => {},
  decrement: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

先上伪代码：

```js
function connect(mapStateToProps, mapDispatchToProps) {
  return function (UIComponet) {
    return class connectedUIComponet {
      render() {
        return <UIComponet />;
      }
    };
  };
}
```

接下来就要实现这个 `connectedUIComponet`。 `connectedUIComponet` 需要往 我们的 `UIComponet` 写入一些属性，将 `store` 中的 `state` 及一些方法提供给 `UIComponet`。

```js
// react-redux.js
export function connect(mapStateToProps, mapDispatchToProps) {
  return function (UIComponet) {
    class connectedUIComponet {
      constructor(props, context) {
        const {store} = context;
        // 将当前的state取出，按我们提供的mapStateToProps取出需要的部分
        const stateProps = mapStateToProps(store.getState());

        if (typeof mapDispatchToProps === 'function') {
          // 把dispatch传入，用来调用reducer函数
          this.dispatchProps = mapDispatchToProps(store.dispatch);
        } else {
          const dispatchProps = {};
          // 如果传入的是一个对象，创建响应的函数。这样在UI组件中就可以直接使用 this.props[key] 来进行dispatch了
          Object.keys(mapDispatchToProps).forEach((key) => {
            const action = mapDispatchToProps[key];
            dispatchProps[key] = (...args) => store.dispatch(action(...args));
          });
          this.dispatchProps = dispatchProps;
        }

        this.state = {
          ...stateProps,
        };

        // 每次store.state更新时，要重新渲染组件，利用setState进行
        store.subscribe(() => {
          this.setState({
            // 还是取出需要的数据
            ...mapStateToProps(store.getState()),
          });
        });
      }
      render() {
        const stateProps = this.state;
        return <UIComponet {...stateProps} {...this.dispatchProps} />;
      }
    }

    // 将context 绑定到当前组件上
    connectedUIComponet.contextType = ProviderContext;
    return connectedUIComponet;
  };
}
```

## combineReducers

redux 提供了将多个 reducer 整合到一起的函数，传入的是关于 reducer 的对象，返回一个函数，实现如下：

```js
//redux.js
export function combineReducers(reducers) {
  return (state = {}, action) => {
    const newState = {};
    Object.keys(reducers).forEach((key) => {
      newState[key] = reducers[key](state[key], action);
    });
    return newState;
  };
}
```

就是 `reducer[key]` 处理对应的 `state[key]`，最后依旧时返回一个全新的对象。可以实现写多层，比如
`reducer.a.b.c.d(state.a.b.c.d,action)`

## compose

`compose` 其实就是函数式编程的实现,`compose(fun1,fun2,fun3,fun4)` 其实就是 `fun1(fun2(fun3(fun4))`.`compose` 返回一个函数，这个函数按照 `4 3 2 1` 的顺序执行

```js
//redux.js
function compose(...funcs) {
  if (funcs.length === 0) {
    return (args) => args;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }

  return (...args) => {
    let f = funcs.pop();
    let v = f(...args);
    for (let i = funcs.length - 1; i >= 0; i--) {
      v = funcs[i](v);
    }
    return v;
  };
}
```

精简写法：

```js
//redux.js
function compose(...funcs) {
  if (funcs.length === 0) {
    return (args) => args;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((curFun, nextFun) => (...args) => curFun(nextFun(...args)));
}
```

我更新换这种写法,从内到外，从右到左执行，更容易理解：

```js
function compose(...funcs) {
  if (funcs.length === 0) {
    return (args) => args;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduceRight((lastFun, preFun) => (...args) => preFun(lastFun(...args)));
}
```

测试一下：

```js
let x = 10;
function fn1(x) {
  console.log('fn1');
  return x + 1;
}
function fn2(x) {
  console.log('fn2');

  return x + 2;
}
function fn3(x) {
  console.log('fn3');

  return x + 3;
}
function fn4(x) {
  console.log('fn4');

  return x + 4;
}

let composeFn = compose(fn1, fn2, fn3, fn4);
let b = composeFn(x); // 理论上也应该得到20
console.log(b);

// 执行结果：
// fn4
// fn3
// fn2
// fn1
// 20
```
