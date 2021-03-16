function limitLoad(urls, handle, limit) {
  let sequence = [...urls];
  limit = limit || Infinity;
  let promises = sequence.splice(0, limit).map((url, index) => {
    return handle(url).then(() => index);
  });

  let p = Promise.race(promises);

  for (let i = 0; i < sequence.length; i++) {
    p = p.then((index) => {
      promises[index] = handle(sequence[i]).then(() => index);
      return Promise.race(promises);
    });
  }
}
