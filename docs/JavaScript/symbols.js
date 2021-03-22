const s1 = Symbol('foo');
const s2 = Symbol('bar');

// let o = {
//   [s1]: 's1',
//   [s2]: 's2',
//   s3: 's3',
//   s4: 's4',
// };

let o = [1, 2, 3];

console.log(Object.keys(o));
console.log(Object.getOwnPropertyNames(o));
console.log(Object.getOwnPropertySymbols(o));
console.log(Object.getOwnPropertyDescriptors(o));
console.log(Reflect.ownKeys(o));
