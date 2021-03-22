/**
 * A 是options 的key，B是params的key
 *
 * A B 都是原始类型 ： B替换A
 * A 对象 B原始 ：报错
 * A原始 B对象 ：B替换A
 * AB都是对象，继续遍历
 *
 */

function isObject(value) {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Object';
}

function merge(options, params = {}) {
  let keys = [...Object.keys(params), ...Object.getOwnPropertySymbols(params)];
  keys.forEach((key) => {
    let isA = isObject(options[key]);
    let isB = isObject(params[key]);
    if (isA && !isB) {
      throw new Error('类型不符合');
    }

    if (isA && isB) {
      options[key] = merge(options[key], params[key]);
      return;
    }

    options[key] = params[key];
  });

  return options;
}
