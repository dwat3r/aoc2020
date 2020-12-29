let util = require("util");
fs = require("fs");

let test = `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`;

let input = fs.readFileSync("16.txt", "utf8");
// first part
String.prototype.splitf = function (sep) {
  return this.split(sep).filter((i) => i);
};

let sum = (arr) => arr.reduce((acc, x) => acc + x);

let parse = (input) => {
  let [srules, syt, snt] = input.splitf("\n\n");
  let rules = srules.splitf("\n").map((i) => {
    let [_, name, ...ns] = i.match(/^([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)$/);
    let [l1, l2, h1, h2] = ns.map((i) => parseInt(i));
    return {
      name: name,
      rule: (n) => (l1 <= n && n <= l2) || (h1 <= n && n <= h2),
    };
  });
  let yt = syt
    .splitf("\n")[1]
    .splitf(",")
    .map((i) => parseInt(i));
  let nt = snt
    .splitf("\n")
    .slice(1)
    .map((i) => i.splitf(",").map((i) => parseInt(i)));
  return { rules: rules, yt: yt, nt: nt };
};

let invalids = (input) =>
  sum(input.nt.flat().filter((t) => !input.rules.some((r) => r.rule(t))));

// console.log(parse(input));
// console.log(invalids(parse(input)));
// second part

let test2 = `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`;

let intersect = (arr1, arr2) => arr1.filter((v) => arr2.includes(v));
let difference = (arr1, arr2) => arr1.filter((v) => !arr2.includes(v));
let mult = arr => arr.reduce((acc, x)=> acc*x)

let run2 = (input) => {
  let vts = input.nt.filter((t) =>
    t.every((tv) => input.rules.some((r) => r.rule(tv)))
  );
  let names = vts
    .map((t) =>
      t.map((tv) => input.rules.filter((r) => r.rule(tv)).map((r) => r.name))
    )
    .reduce((acc, t) => acc.map((av, ix) => intersect(av, t[ix])))
    .map((names, ix) => ({ ix: ix, name: names }))
    .sort((x, y) => x.name.length - y.name.length)
    .reduce(
      (acc, tv) => [
        ...acc,
        {
          ix: tv.ix,
          name: difference(
            tv.name,
            acc.flatMap((tv) => tv.name)
          )[0],
        },
      ],
      []
    );
  let departs = names.filter(n=> n.name.includes("departure"))
  return mult(input.yt.filter((t,ix)=> departs.some(n=>n.ix === ix)))
};

let vb = (v) => util.inspect(v, false, null, true);

console.log(vb(run2(parse(input))));
