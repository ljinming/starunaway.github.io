function limitPromise(promises, limit) {
  limit = limit || Infinity;
  let sequence = [...promises];
  let limitArr = sequence.splice(0, limit).map((p, index) => {
    p();
    return index;
  });
  let p = Promise.race(limitArr);

  for (let i = 0; i < sequence.length; i++) {}
}
