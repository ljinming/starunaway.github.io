let arr = [1, 23, [3, 4, 5, [45, 234, [657]]]];

while (arr.some((item) => Array.isArray(item))) {
  console.log(...arr);
  arr = [].concat(...arr);
}

// arr = arr.flat(Infinity);

// arr = arr
//   .toString()
//   .split(',')
//   .map((v) => parseInt(v));

// arr = JSON.stringify(arr)
//   .replace(/\[|\]/g, '')
//   .split(',')
//   .map((v) => parseInt(v));

console.log(arr);
