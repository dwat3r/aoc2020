const util = require("util");
const fs = require("fs");
const { findIndex } = require("lodash");

let vb = (v) => util.inspect(v, { compact: true, colors: true });

let test = `1 + 2 * 3 + 4 * 5 + 6`;
let test2 = `1 + (2 * 3) + (4 * (5 + 6))`;
let test3 = `2 * 3 + (4 * 5)`;
let test4 = `5 + (8 * 3 + 9 + 3 * 4 * 3)`;
let test5 = `5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`;
let test6 = `((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`;

let input = fs.readFileSync("18.txt", "utf8");
//part1

let parse = (input) => input.split("").filter((i) => i && i !== " ");

let plus = (x, y) => x + y;
let mult = (x, y) => x * y;

let calc = (input) => {
  return (function rec(res, op, input) {
    if (input.length === 0) return res;
    let [x, ...tail] = input;
    if (/\d/.test(x)) {
      return rec(op(res, parseInt(x)), op, tail);
    } else if (x === "+") {
      return rec(res, plus, tail);
    } else if (x === "*") {
      return rec(res, mult, tail);
    } else if (x === "(") {
      let { subres, rem } = rec(0, plus, tail);
      return rec(op(res, subres), op, rem);
    } else if (x === ")") {
      return { subres: res, rem: tail };
    }
  })(0, plus, input);
};

let run = (input) =>
  input
    .split("\n")
    .filter((i) => i)
    .map((expr) => calc(parse(expr)))
    .reduce((acc, x) => acc + x);

//console.log(run(input));
// part2

let calc2 = (input) => {
  return (function rec(res, op, input) {
    if (input.length === 0) return res;
    let [x, ...tail] = input;
    if (/\d/.test(x)) {
      return rec(op(res, parseInt(x)), op, tail);
    } else if (x === "+") {
      return rec(res, plus, tail);
    } else if (x === "*") {
      return rec(res, mult, tail);
    } else if (x === "(") {
      let { subres, rem } = rec(0, plus, tail);
      return rec(op(res, subres), op, rem);
    } else if (x === ")") {
      return { subres: res, rem: tail };
    }
  })(0, plus, input);
};

console.log(calc2(parse(test)));