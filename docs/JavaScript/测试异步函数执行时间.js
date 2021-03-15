function measure(target, name, descriptor) {
  const oldValue = descriptor.value;
  descriptor.value = async function () {
    console.time(`${name}`);
    let res = await oldValue.apply(this, arguments);
    console.timeEnd(`${name}`);
    res;
  };
  return descriptor;
}
