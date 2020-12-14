let input = document
  .querySelector("pre")
  .textContent.split("\n")
  .filter((i) => i);
// first part
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

let test = "7,13,x,x,59,x,31,19".split(",")
    .map((i, ix) => ({ s: parseInt(i), ix: ix }))
    .filter((six) => !isNaN(six.s))
    .sort((x, y) => y.s - x.s);

  let input = document
    .querySelector("pre")
    .textContent.split("\n")
    .filter((i) => i);
  let schedule = input[1]
      .split(",")
      .map((i, ix) => ({ s: parseInt(i), ix: ix }))
      .filter((six) => !isNaN(six.s))
      .sort((x, y) => y.s - x.s);
  let solve = input => {let i = 0;while (!(input.every(s => (i + (s.ix % s.s)) % s.s === 0))){i=i+input[input.length-1].s;};return i;}

  solve(schedule)
