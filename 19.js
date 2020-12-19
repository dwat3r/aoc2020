let test = `0: 1 2
1: "a"
2: 1 3 | 3 1
3: "b"

aab
aba`;

let test2 = `0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb`;

//let input = document.querySelector("pre").textContent

// part 1
let rules = (input) =>
  [...input]
    .filter((c) => c != '"')
    .join("")
    .split("\n")
    .reduce((m, l) => {
      let [i, rest] = l.split(":");
      let rs = rest.split("|").map((r) => r.split(" ").filter((i) => i));
      return { ...m, [i]: rs };
    }, {});

let check = (input) => {
  let [ri, mi] = input.split("\n\n");
  let rule = rules(ri);
  console.log(rule);
  return mi
    .split("\n")
    .filter((i) => i)
    .flatMap((m) =>
      run(rule, "0", m, 0).map(
        (r) => r.valid && r.iix === m.length
      )
    ).filter(i => i).length;
};

let run = (rule, rix, m, ix) => {
  if (ix === m.length) return [{ valid: true, iix: ix }];
  return rule[rix]
    .map((r) =>
      r.reduce(
        (v, rix) => {
          if (/\d+/.test(rix)) {
            let ret = run(rule, rix, m, v.iix);
            return {
              valid: v.valid && ret.length > 0 && ret[0].valid,
              iix: ret.length > 0 ? ret[0].iix : v.iix,
            };
          } else {
            return { valid: v.valid && rix === m[v.iix], iix: v.iix + 1 };
          }
        },
        { valid: true, iix: ix }
      )
    )
    .filter((v) => v.valid);
};

//console.log(check(test2));
// part 2
let test3 = `42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31 | 42 11 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42 | 42 8
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa`

console.log(check(test3))