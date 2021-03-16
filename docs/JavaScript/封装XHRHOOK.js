class xhrHook {
  constructor(beforehook, afterhook) {
    this.XHR = window.XMLHttpRequest;
    this.beforehook = beforehook;
    this.afterhook = afterhook;
    this.init();
  }

  init = () => {
    const _this = this;
    window.XMLHttpRequest = function () {
      this._xhr = new _this.XHR();
      _this.overwrite(this);
    };
  };

  overwrite = (proxyXHR) => {
    for (let key in proxyXHR._xhr) {
      if (typeof proxyXHR._xhr[key] === 'function') {
        this.overwriteMethod(key, proxyXHR);
      } else {
        this.overwriteAttributes(key, proxyXHR);
      }
    }
  };

  // 重写方法
  overwriteMethod = (key, proxyXHR) => {
    let beforehooks = this.beforehook;
    let afterhooks = this.afterhook;

    proxyXHR[key] = (...args) => {
      if (beforehooks[key]) {
        const res = beforehooks[key].call(proxyXHR._xhr, ...args);
        if (res === false) {
          return;
        }
      }

      const res = proxyXHR._xhr[key].apply(proxyXHR._xhr, args);

      if (afterhooks[key]) {
        afterhooks[key].apply(proxyXHR._xhr, args);
      }
      return res;
    };
  };
  overwriteAttributes = (key, proxyXHR) => {
    Object.defineProperties(proxyXHR, key, this.setProterty(key, proxyXHR));
  };

  setProterty = (key, proxyXHR) => {
    let obj = Object.create(null);
    obj.set = (val) => {
      if (!key.startsWith('on')) {
        proxyXHR['__' + key] = val;
        return;
      }
      if (this.beforehook[key]) {
        this._xhr[key] = function (...args) {
          this.beforehook[key].call(proxyXHR);
          val.apply(proxyXHR, args);
        };
        return;
      }

      this._xhr[key] = val;
    };
    obj.get = () => {
      return proxyXHR['__' + key] || this._xhr[key];
    };
  };
}

new xhrHook({
  open() {},
});

let ajax = new window.XMLHttpRequest();

ajax.open();
