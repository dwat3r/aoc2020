var _ = require('lodash');
//var hash = require('object-hash');

let test = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

let input = `Player 1:
25
37
35
16
9
26
17
5
47
32
11
43
40
15
7
19
36
20
50
3
21
34
44
18
22

Player 2:
12
1
27
41
4
39
13
29
38
2
33
28
10
6
24
31
42
8
23
45
46
48
49
30
14`;

let parse = (input) => {
  let [sp1, sp2] = input.split("\n\n").filter((i) => i);
  let p1 = sp1
    .split("\n")
    .filter((i) => i)
    .slice(1)
    .map((i) => parseInt(i));
  let p2 = sp2
    .split("\n")
    .filter((i) => i)
    .slice(1)
    .map((i) => parseInt(i));
  return { p1: p1, p2: p2 };
};
// part1
let play = (gs) => {
  return (function round(gs) {
    if (gs.p1.length === 0 || gs.p2.length === 0) return gs;
    let c1 = gs.p1.shift();
    let c2 = gs.p2.shift();
    if (c1 > c2) {
      gs.p1.push(c1, c2);
    } else {
      gs.p2.push(c2, c1);
    }
    return round(gs);
  })(gs);
};

let score = (gs) => {
  if (gs.p1.length === 0) {
    return gs.p2
      .map((x, ix) => x * (gs.p2.length - ix))
      .reduce((acc, x) => acc + x);
  } else {
    return gs.p1
      .map((x, ix) => x * (gs.p1.length - ix))
      .reduce((acc, x) => acc + x);
  }
};

// console.log(parse(input))
// console.log(play(parse(input)))
// console.log(score(play(parse(input))))

// part2
// let hash = gs => 
//   7919*gs.p1.map((x,ix) => x*ix).reduce((acc,x)=>acc+x,1)+7727*
//   gs.p2.map((x,ix) => x*ix).reduce((acc,x)=>acc+x,1)

let hash = gs => `${gs.p1.join(",")} ${gs.p2.join(",")}`


let playRec = (gs) => {
  //let memo = new Map()
  return (function round(gs, prevRounds) {
    //if(memo.size > 0 && memo.size % 1000000 === 0) console.log(memo.size)
    // if(memo.has(hash(gs))) {
    //   // if(!_.isEqual(memo.get(hash(gs)).gs, gs)) {
    //   //   console.log(memo.get(hash(gs)).gs, gs)
    //   //   throw Error(`Hash collision: `)
    //   // }
    //   return memo.get(hash(gs))
    // }
    if (gs.p2.length === 0 || prevRounds[hash(gs)]) {    
      let ret = { gs: gs, winner: 1 };
    //  memo.set(hash(gs), _.cloneDeep(ret))
      return ret;
    }
    if (gs.p1.length === 0) {
      let ret = { gs: gs, winner: 2 };
    //  memo.set(hash(gs), _.cloneDeep(ret))
      return ret;
    }
    prevRounds[hash(gs)] = true
    let c1 = gs.p1.shift();
    let c2 = gs.p2.shift();
    // recurse
    if (gs.p1.length >= c1 && gs.p2.length >= c2){
      //console.log("recursed")
      var hwinner;
      // if(memo.has(hash(gs))) {
      //   // if(!_.isEqual(memo.get(hash(gs)).gs, gs)) {
      //   //   console.log(memo.get(hash(gs)).gs, gs)
      //   //   throw Error(`Hash collision: `)
      //   // }
      //    hwinner = memo.get(hash(gs)).winner
      // } else {
        let ret = round(_.cloneDeep(gs), {})
      //  memo.set(hash(gs), _.cloneDeep(ret))
        hwinner = ret.winner
      //}
      //console.log("recursed",winner)
      if(hwinner === 1){
        gs.p1.push(c1,c2)
      } else {
        gs.p2.push(c2,c1)
      }
    } else if (c1 > c2) {
      gs.p1.push(c1, c2);
    } else {
      gs.p2.push(c2, c1);
    }
    return round(gs, prevRounds);
  })(gs, {});
};

let testI = `Player 1:
43
19

Player 2:
2
29
14`

// console.log(parse(test))
// console.log(playRec(parse(input)))
console.log(score(playRec(parse(test)).gs))
let ret = playRec(parse(input))
console.log(ret)
console.log(score(ret.gs))