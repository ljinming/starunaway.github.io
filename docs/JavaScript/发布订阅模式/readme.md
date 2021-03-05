# 发布订阅模式

## 简介

发布订阅模式和观察者模式是一回事。可以让多个观察者同时监听一个对象或事件，当该对象改变或事件触发时，所有的观察者可以收到通知。

实现思路就是定义一个`listeners`，把观察者关注的事件和对应的处理方法注册到`listeners`。当事件触发时，调用所有观察者注册的事件

## 代码实现

```js
class EventBridge {
  constructor() {
    this.listeners = new Map();
  }

  on(event = 'defaulteventname', fn, isOnce = false) {
    if (typeof fn !== 'function') {
      throw new Error('the second argument must be a function');
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const events = this.listeners.get(event);
    let hasFn = false;
    for (let e of events) {
      if (e.eb === fn) {
        hasFn = true;
        break;
      }
    }

    if (!hasFn) {
      events.add({cb: fn, isOnce});
    }
  }

  emit(event, ...args) {
    if (this.listeners.has(event)) {
      const events = this.listeners.get(event);
      events.forEach((e) => {
        e.cb(...args);
        if (e.isOnce) {
          this.remove(event, e.cb);
        }
      });

      if (events.size === 0) {
        this.listeners.delete(event);
      }
    } else {
      console.warn(`${event} has no listeners`);
    }
  }

  remove(event, fn) {
    const events = this.listeners.get(event);
    if (events && fn) {
      events.forEach((e) => {
        e.cb === fn && events.delete(e);
      });
    }
  }

  removeAll(event) {
    const events = this.listeners.get(event);
    events && this.listeners.delete(event);
  }
}
```

通过 `remove`或 `removeAll`可以在需要的时候移除指定的事件监听，释放内存

## 注册异步事件

可以在 `listener`上注册异步事件，在需要的时候进行调用.`eventBridge.registryProxy("proxy.name",fn)`.需要使用的时候，
`eventBridge.registryProxy.proxy.name()`

## 注册异步事件代码

新增以下代码

```js
class ProxyCaller {
  constructor(Fn) {
    this.path = '';
    this.Fn = Fn;

    this.proxy = new Proxy(this.Fn, {
      get: (target, key) => this.setPath(key),
      apply: (target, obj, args) => {
        const callerPath = this.path;
        this.path = '';
        return this.Fn.call(obj, callerPath, ...args);
      },
    });

    return this.proxy;
  }
  setPath(path) {
    //   每次使用 . 获取的时候，寻找到函数本体
    if (!this.path) {
      this.path = path;
    } else {
      this.path += `.${path}`;
    }
    return this.proxy;
  }
}

class EventBridge {
  constructor() {
    this.listeners = new Map();
    //  新增this.callProxy
    this.callProxy = async (proxyname, ...args) => {
      const random = `_callProxy.${Date.now()}${Math.random().toString().substr(2, 10)}.${proxyname}`;
      const result = this._proxyOnce(random);
      this.emit(`_proxy.${proxyname}`, {
        eventname: random,
        params: args,
      });
      try {
        return await result;
      } catch (err) {
        console.error(`[EB Call ${proxyname}]`);
        return Promise.reject(err);
      }
    };
  }

  get proxy() {
    return new ProxyCaller(this.callProxy);
  }

  //  +新增
  _proxyOnce(event) {
    return new Promise((resolve, reject) => {
      const callback = (payload) => {
        if (payload && payload._isRejected) {
          reject(payload.payload);
        } else if (payload && payload._isRejected === false) {
          resolve(payload.payload);
        } else {
          resolve(payload);
        }
      };

      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }

      const events = this.listeners.get(event);

      let hasCallback = false;
      events.forEach((e) => {
        if (e.cb === callback) {
          hasCallback = true;
        }
      });
      if (!hasCallback) {
        events.add({cb: _callback, isOnce: true});
      }
    });
  }

  registerProxy(event, fn) {
    this.unregisterProxy(event);

    this.on(`_proxy.${event}`, async ({eventname, params}) => {
      try {
        if (typeof fn === 'function') {
          const result = await fn(...params);
          this.emit(eventname, {
            payload: result,
            _isRejected: false,
          });
        }
      } catch (error) {
        console.error(`[EB Proxy ${event}]`);
        this.emit(eventname, {
          payload: error,
          _isRejected: true,
        });
      }
    });
  }

  unregisterProxy(event) {
    this.removeAll(`_proxy.${event}`);
  }
}
```
