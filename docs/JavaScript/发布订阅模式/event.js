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

  remove(event, fn) {
    const events = this.listeners.get(event);
    if (events && fn) {
      events.forEach((e) => {
        e.cb === fn && events.delete(e);
      });
    }
  }

  get proxy() {
    return new ProxyCaller(this.callProxy);
  }

  removeAll(event) {
    const events = this.listeners.get(event);
    events && this.listeners.delete(event);
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

let eb = new EventBridge();

debugger;
eb.registerProxy('a.b.c.d', (v1, v2) => {
  console.log(v1, v2);
});

async function as() {
  try {
    let v = await eb.proxy.a.b.c.d(5, 6);
    console.log(v);
  } catch (e) {}
}
as();
