Array.prototype.myReduce = function (callback, init) {
  let pre = this[0];

  if (init !== undefined) {
    pre = init;
  }

  for (let i = 0; i < this.length; i++) {
    pre = callback(pre, this[i], i, this);
  }
  return pre;
};
const a = [1, 2, 3, 4, 5].reduce((pre, cur, curIdx, arr) => {
  console.log(pre, cur, curIdx, arr);
  return pre + cur;
}, undefined);

console.log(a);
