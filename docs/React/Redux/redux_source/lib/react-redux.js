import React from 'react';

const ProviderContext = React.createContext(null);

export class Provider extends React.Component {
  render() {
    const {children, store} = this.props;
    // console.log(children, store);
    return <ProviderContext.Provider value={{store}}>{children}</ProviderContext.Provider>;
  }
}

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
