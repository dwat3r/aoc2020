let input = document
  .querySelector("body > pre")
  .textContent.split("\n")
  .filter((i) => i)
  .map((i) => parseInt(i));
// first part
let res = input
  .sort((x, y) => x - y)
  .slice(1)
  .reduce(
    (acc, x) => ({
      c: x,
      d1: acc.d1 + (acc.c + 1 === x ? 1 : 0),
      d2: acc.d2 + (acc.c + 2 === x ? 1 : 0),
      d3: acc.d3 + (acc.c + 3 === x ? 1 : 0),
    }),
    { c: input[0], d1: 0, d2: 0, d3: 0 }
  );
(res.d1 + 1) * (res.d3 + 1);
// second part
let calcDiffs = (input) => {
  let sorted = input.sort((x, y) => x - y);
  let diffs = [0, ...sorted, Math.max(...sorted) + 3]
    .reduce((acc, x, ix, xs) => acc.concat(x - xs[ix - 1]), [])
    .slice(1);
  return diffs.reduce(
    (acc, x) =>
      x === 1
        ? {
            sub: acc.sub + 1,
            res: acc.res,
          }
        : {
            sub: 0,
            res: acc.res * trib(acc.sub + 2),
          },
    { sub: 0, res: 1 }
  );
};
let trib = ((f) => {
  let m = [0, 0, 1];
  return function tri(n) {
    if (m[n] != undefined) {
      return m[n];
    }
    let ret = tri(n - 1) + tri(n - 2) + tri(n - 3);
    m[n] = ret;
    return ret;
  };
})();
calcDiffs(input);

// dynamic programming solution for part2
let calc = (input,memo,n) => {if(memo[n] !== undefined) {return memo[n];}let ret = calc(input,memo,n-1) + (((input[n] - input[n-2] <= 3) ? calc(input,memo,n-2) : 0) + ((input[n] - input[n-3] <= 3) ? calc(input,memo,n-3) : 0));memo[n] = ret;return ret;}
let memo = [1];calc([0,...input,input[input.length -1]+3],memo,input.length+2)
