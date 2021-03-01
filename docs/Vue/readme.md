# 数据劫持

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .checked {
        background: steelblue;
        color: white;
      }
    </style>
  </head>
  <body>
    <div id="result">0</div>
    <div><input type="text" id="firstValue" value="0" /></div>
    <div><input type="text" id="secondValue" value="0" /></div>
    <div id="btns">
      <button class="btn" data-option="add">+</button>
      <button class="btn" data-option="minus">-</button>
      <button class="btn" data-option="times">*</button>
      <button class="btn" data-option="division">/</button>
    </div>

    <script src="./calc.js"></script>
  </body>
</html>
```

```js
class Compute {
  add(a, b) {
    return a + b;
  }

  minus(a, b) {
    return a - b;
  }
  times(a, b) {
    return a * b;
  }
  division(a, b) {
    return a / b;
  }
}

class Calculator extends Compute {
  constructor() {
    super();
    this.resultElement = document.querySelector('#result');
    this.firstValueElement = document.querySelector('#firstValue');
    this.secondValueElement = document.querySelector('#secondValue');
    this.btnsElement = document.querySelector('#btns');
    this.values = this.defineProperties();
  }

  defineProperties() {
    const _obj = {};
    const _self = this;
    let first, second, opt;
    Object.defineProperties(_obj, {
      result: {
        set(value) {
          _self.resultElement.innerHTML = value;
        },
      },

      firstValue: {
        get() {
          return first;
        },
        set(value) {
          first = value;
          console.log('set firstValue', value);
          _self.calculateValue(first, second, opt);

          return value;
        },
      },
      secondValue: {
        get() {
          return second;
        },
        set(value) {
          second = value;
          console.log('set secondValue', value);
          _self.calculateValue(first, second, opt);

          return value;
        },
      },
      opt: {
        get() {
          return opt;
        },
        set(value) {
          opt = value;
          for (let btn of _self.btnsElement.children) {
            if (btn.getAttribute('data-option') === value) {
              btn.classList.add('checked');
            } else {
              btn.classList.remove('checked');
            }
          }

          _self.calculateValue(first, second, opt);

          return value;
        },
      },
    });

    return _obj;
  }

  calculateValue(first, second, option) {
    let result = this[option](Number(first || 0), Number(second || 0));
    if (result || result === 0) {
      this.values.result = result;
    }
  }

  handleInputUpdate(e) {
    const {target} = e;
    if (target.id === 'firstValue') {
      this.values.firstValue = target.value;
    } else if (target.id === 'secondValue') {
      this.values.secondValue = target.value;
    }
  }

  handleBtnClick(e) {
    const {target} = e;
    const opt = target.getAttribute('data-option');
    if (opt) {
      this.values.opt = opt;
    }
  }

  init() {
    this.firstValueElement.addEventListener('input', this.handleInputUpdate.bind(this));
    this.secondValueElement.addEventListener('input', this.handleInputUpdate.bind(this));
    this.btnsElement.addEventListener('click', this.handleBtnClick.bind(this));
    this.values.opt = 'add';
  }
}

new Calculator().init();
```
