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
          // recursive case
          // if(/\d+n/.test(rix)) {
          //   let [_, rixr] = rix.match(/(\d+)n/)
          //   var ret = run(rule, rixr, m, ret.iix);
          //   while(ret.valid && ret.iix != m.length) {
          //     let nret = run(rule, rixr, m, ret.iix);
          //     if (!nret.valid) break;
          //     else {
          //       ret = nret;
          //     }
          //     ret.iix++;
          //   }
          //   return ret;
          //} else 
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
let test3 = `0: 1 2
1: "a"
2: 3n
3: "b"

aab
aba`
// replace loop expression with regular one: 
// 8: 42 | 42 8 => 8: 42n
console.log(check(test3))