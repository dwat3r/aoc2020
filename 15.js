const trampoline = (fn) => (...args) => {
  let result = fn(...args);
  while (typeof result === "function") {
    result = result();
  }
  return result;
};

//let input = "2,1,10,11,0,6";
let input ="0,3,6"
let psh = (arr, e) => {
  if (arr.length === 2) {
    arr.shift();
    arr.push(e);
  } else {
    arr.push(e);
  }
};

let play = (rinput) => {
  let input = rinput.split(",");
  let memo = input.reduce(
    (acc, x) => {acc.res[x] = [acc.i];return ({ i: acc.i + 1, res: acc.res })},
    {
      i: 1,
      res: [],
    }
  ).res;
  //console.log(memo)
  return trampoline(function step(last, turn) {
    //console.log(turn,last,memo)
    if(turn%1000000===0){console.log(turn,last)}
    if (turn === 30000001) {
      return last;
    }
    if (memo[last].length === 1) {
      if (memo[0] === undefined) {
        memo[0] = [turn];
      } else {
        psh(memo[0], turn);
      }
      return () => step(0, turn + 1);
    } else {
      let nlast = memo[last][1] - memo[last][0];
      if (memo[nlast] === undefined) {
        memo[nlast] = [turn];
      } else {
        psh(memo[nlast], turn);
      }
      return () => step(nlast, turn + 1);
    }
  })(input[input.length - 1], input.length+1);
};
console.log(play(input));
// to do on one sunny day: optimize this