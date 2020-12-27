let test = `0: 1 2
1: "a"
2: 1 3 | 3 1
3: "b"

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
      run(rule, "0", m, 0).map((r) => r.valid && r.iix === m.length)
    )
    .filter((i) => i).length;
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

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
aaaabbaaaabbaaa
babaaabbbaaabaababbaabababaaab
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`


let test4 = `0: 8 11
2: "a" 24 | "b" 4
3: 5 "b" | 16 "a"
4: "a" "a"
5: "a" "b" | 15 "a"
6: "b" "b" | "a" "b"
7: "b" 5 | "a" 21
8: 42 | 42 8
9: "b" 27 | "a" 26
10: 23 "b" | 28 "a"
11: 42 31 | 42 11 31
12: 24 "b" | 19 "a"
13: "b" 3 | "a" 12
15: "a" | "b"
16: 15 "a" | "b" "b"
17: "b" 2 | "a" 7
18: 15 15
19: "b" "a" | "b" "b"
20: "b" "b" | "a" 15
21: "b" "a" | "a" "b"
22: "b" "b"
23: 25 "a" | 22 "b"
24: "b" "a"
25: "a" "a" | "a" "b"
26: "b" 22 | "a" 20
27: "a" 6 | "b" 18
28: 16 "a"
31: "b" 17 | "a" 13
42: 9 "b" | 10 "a"

babbbbaabbbbbabbbbbbaabaaabaaa`

// abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
// bbabbbbaabaabba
// babbbbaabbbbbabbbbbbaabaaabaaa
// aaabbbbbbaaaabaababaabababbabaaabbababababaaa
// bbbbbbbaaaabbbbaaabbabaaa
// bbbababbbbaaaaaaaabbababaaababaabab
// ababaaaaaabaaab
// ababaaaaabbbaba
// baabbaaaabbaaaababbaababb
// abbbbabbbbaaaababbbbbbaaaababb
// aaaaabbaabaaaaababaa
// aaaabbaaaabbaaa
// aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
// babaaabbbaaabaababbaabababaaab
// aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba`


let check2 = (input) => {
  let [ri, mi] = input.split("\n\n");
  let rule = rules(ri);
  //console.log(rule);
  return mi
    .split("\n")
    .filter((i) => i)
    .flatMap((m) => {
      let {valid, ix} = validate(rule, m)
      //return valid && ix === m.length
      return {valid, ix}
    }
    )
   //.filter((i) => i).length;
};

// todo the case when looping match fails with insufficent input
let validate = (rule, word) => {
  return function rec(rix, ix, depth) {
    var nix = ix;
    if (/\d+/.test(rix)) {
      var [nrixs, ...nrxst] = rule[rix];
      var [nrix, ...nrxt] = nrixs;
      var rvalid = true;
      while (true) {
        while (true) {
          let {valid, ix} = rec(nrix, nix, depth+1);
          rvalid = valid;
          if(rvalid) nix=ix;
          if(nrxt.length === 0 || !rvalid) break;
          var [nrix, ...nrxt] = nrxt;
        }
        if(rvalid || nrxst.length === 0) break;
        if(!rvalid){
          nix = ix;
          var [nrixs, ...nrxst] = nrxst;
          var [nrix, ...nrxt] = nrixs;
          rvalid = true;
        }
      }
      return {valid: rvalid, ix: nix}
    } else {
      //if (word[ix] !== rix) console.log(rix,word[ix], [...word].slice(0, nix).join(""), [...word].slice(nix).join(""), depth)
      return word[ix] === rix
        ? {valid: true, ix: ix+1}
        : {valid:false, ix: ix}
    }
  }('0',0, 0);
};

console.log(check2(test4));
