const input = document
  .querySelector("body > pre")
  .textContent.split("\n")
  .map((i) => i.split(""));
// first part
input.reduce(
  (acc, i) => ({
    x: (acc.x + 3) % 31,
    res: acc.res + (i[acc.x] === "#" ? 1 : 0),
  }),
  { x: 0, res: 0 }
).res;
// second part
let { res1, res3, res5, res7, resx } = input.reduce(
  (acc, i) => {
    return {
      x1: (acc.x1 + 1) % 31,
      x3: (acc.x3 + 3) % 31,
      x5: (acc.x5 + 5) % 31,
      x7: (acc.x7 + 7) % 31,
      xx: (acc.xx + (acc.cl % 2)) % 31,
      cl: acc.cl + 1,
      res1: acc.res1 + (i[acc.x1] === "#" ? 1 : 0),
      res3: acc.res3 + (i[acc.x3] === "#" ? 1 : 0),
      res5: acc.res5 + (i[acc.x5] === "#" ? 1 : 0),
      res7: acc.res7 + (i[acc.x7] === "#" ? 1 : 0),
      resx: acc.resx + (acc.cl % 2 === 0 && i[acc.xx] === "#" ? 1 : 0),
    };
  },
  {
    x1: 0,
    x3: 0,
    x5: 0,
    x7: 0,
    xx: 0,
    cl: 0,
    res1: 0,
    res3: 0,
    res5: 0,
    res7: 0,
    resx: 0,
  }
);
res1 * res3 * res5 * res7 * resx;
