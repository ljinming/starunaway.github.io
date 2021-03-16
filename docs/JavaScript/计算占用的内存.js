function caclMemory(obj) {
  const objType = typeof obj;
  switch (objType) {
    case 'string':
      return obj.length * 2;
    case 'number':
      return 8;
    case 'boolean':
      return 4;
    case 'object':
      if (Array.isArray(obj)) {
        return obj.reduce((pre, cur) => caclMemory(cur) + pre, 0);
      } else {
        return getSizeOfObject(obj);
      }
    default:
      return 0;
  }
}

let haveCalc = new WeakSet();

function getSizeOfObject(obj) {
  if (obj === null) {
    return 0;
  }
  let bytes = 0;
  let keys = Object.keys(obj);
  keys.forEach((key) => {
    const property = obj[key];
    bytes += caclMemory(key);
    if (typeof property === 'object' && property !== null) {
      if (haveCalc.has(property)) {
        return;
      } else {
        haveCalc.add(property);
      }
    }
    bytes += caclMemory(property);
  });
  return bytes;
}

let a = {
  keys1: 1,
};
console.log(caclMemory({key1: '5', key2: a, key3: a}));
