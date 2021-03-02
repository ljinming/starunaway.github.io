let a = {
  value: 0,
  valueOf() {
    console.log(this.value);
    this.value = this.value + 1;
    return this.value;
  },
};

if (a === 1 && a == 2 && a == 3) {
  console.log(true);
}
