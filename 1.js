function deepClone(obj) {
  const objCtor = obj.constructor;
  const root = new objCtor();
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: obj,
    },
  ];

  while (loopList.length) {
    const node = loopList.pop();
    const {parent, key, data} = node;
    let res = parent;
    // 如果有key，需要创建key对应的节点层次
    if (key !== undefined) {
      const Ctor = data.constructor;
      parent[key] = new Ctor();
      res = parent[key];
    }

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }
  return root;
}

const obj = {
  a1: {},
  a2: {},
  a3: {
    b1: [5, {c: 5}],
  },
};

let b = deepClone(obj);
b.a3.b1[1].c = 66;

console.log(obj.a3.b1);
console.log(b.a3.b1);
