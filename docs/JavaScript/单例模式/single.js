function Un(u) {
  //   let _instance = this;

  if (Un._instance) {
    return Un._instance;
  }
  this.u = u;

  Un._instance = this;
}

Un.prototype.is = 1;

const u1 = new Un(888);
Un.prototype.t = 8;

const u2 = new Un(777);
console.log(u1, u2, u1 === u2);
console.log(u1.is, u1.t);
console.log(u2.is, u2.t);
