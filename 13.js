let input = document
  .querySelector("pre")
  .textContent.split("\n")
  .filter((i) => i);
//first part
let find = (input) => {
  let arrive = parseInt(input[0]);
  let schedule = input[1]
    .split(",")
    .filter((i) => i !== "x")
    .map((i) => parseInt(i));
  let { s, t } = schedule
    .map((s) => ({ s: s, t: s - (arrive % s) }))
    .reduce((acc, x) => (acc.t < x.t ? acc : x));
  return s * t;
};
find(input);
// second part
const trampoline = (fn) => (...args) => {
  let result = fn(...args);
  while (typeof result === "function") {
    result = result();
  }
  return result;
};
let findArranged = (input) => {
  let schedule = input
    .split(",")
    .map((i, ix) => ({ s: parseInt(i), ix: ix }))
    .filter((six) => !isNaN(six.s))
    .sort((x, y) => y.s - x.s);
  console.log(schedule);
  return trampoline(function elim(n, sched) {
    let [s, ...tail] = sched;
    //console.log(n, sched, (n + s.ix) % s.s);
    if ((n + s.ix) % s.s === 0) {
      if (tail.length === 0) {
        return n;
      } else {
        if (elim(n, tail) === n) {
          return n;
        } else {
          return () => elim(n + s.s, sched);
        }
      }
    } else {
      return false;
    }
  })(schedule[0].s - schedule[0].ix, schedule);
};

let prep = (input) =>
  input
    .split(",")
    .map((i, ix) => ({ s: parseInt(i), ix: BigInt(ix) }))
    .filter((six) => !isNaN(six.s))
    .map((six) => ({ ...six, s: BigInt(six.s) }));

let test = "7,13,x,x,59,x,31,19";
let stest = "17,x,13,19";
let sstest = "1789,37,47,1889";

let input =
  "19,x,x,x,x,x,x,x,x,41,x,x,x,37,x,x,x,x,x,367,x,x,x,x,x,x,x,x,x,x,x,x,13,x,x,x,17,x,x,x,x,x,x,x,x,x,x,x,29,x,373,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,23";
let schedule = prep(input);

// example solution formula for 67,7,59,61 is:
// 67*(5) + 67*7*(14) + 67*7*59*(27)
// you have to find the numbers in parentheses.
let solve = (input) => {
  var n = input[0].s;
  var m = Array(input.length - 1).fill(0n);
  var i = 1;
  m[0] = 1n;
  console.log(n, m);
  while (i !== input.length) {
    while (true) {
      n = m.reduce(
        (acc, x) => ({
          ix: acc.ix + 1,
          s:
            acc.s +
            input
              .slice(0, acc.ix)
              .map((six) => six.s)
              .reduce((acc, x) => acc * x, 1n) *
              x,
        }),
        { ix: 1, s: 0n }
      ).s;
      console.log(n, m, (n + input[i].ix) % input[i].s);
      if ((n + input[i].ix) % input[i].s === 0n) break;
      m[i - 1]++;
    }
    i++;
  }
  return [n, m];
};

console.log(prep(input));
console.log(solve(prep(input)));
