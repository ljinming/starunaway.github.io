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

function getSizeOfObject(obj) {
  let keys = Object.keys(obj);
}
