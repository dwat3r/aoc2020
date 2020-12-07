const input = document
  .querySelector("pre")
  .textContent.split("\n")
  .map((i) => i.split(""));
// first part
let bs = (inp, lc, hc) =>
  inp.reduce(
    (acc, x) => {
      return {
        p: acc.p >> 1,
        l: x === lc ? acc.l : acc.l + acc.p,
        h: x === hc ? acc.h : acc.h - acc.p,
      };
    },
    { p: 2 << (inp.length - 2), l: 0, h: (2 << (inp.length - 1)) - 1 }
  ).l;
input
  .map((i) => bs(i.slice(0, 7), "F", "B") * 8 + bs(i.slice(7), "L", "R"))
  .reduce((acc, x) => (acc >= x ? acc : x));
// second part
input
  .map((i) => bs(i.slice(0, 7), "F", "B") * 8 + bs(i.slice(7), "L", "R"))
  .sort((a, b) => a - b)
  .slice(1)
  .reduce((acc, x) => (acc + 1 === x ? x : acc)) + 1;
