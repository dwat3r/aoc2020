let input = document.querySelector("body > pre").textContent.split('\n').filter(i => i).map(i => parseInt(i))
// first part
let res = input.sort((x,y) => x - y).slice(1).reduce((acc,x) => ({c:x,d1: acc.d1 + (acc.c + 1 === x ? 1 : 0), d2: acc.d2 + (acc.c + 2 === x ? 1 : 0),d3: acc.d3 + (acc.c + 3 === x ? 1 : 0) }),{c:input[0],d1:0,d2:0,d3:0})
(res.d1 + 1) * (res.d3 + 1)
// second part
let calcDiffs = (input) => {let sorted = input.sort((x,y) => x - y);let diffs = [0,...sorted, Math.max(...sorted) + 3].reduce((acc,x,ix,xs) => acc.concat(x - xs[ix - 1]),[]).slice(1);return diffs.reduce((acc,x) => (x === 1 ? {sub: acc.sub + 1, subres: (acc.sub >= 3 ? acc.subres + acc.sub : Math.pow(2,acc.sub)), res: acc.res} : {sub: 0, subres:0, res: (acc.subres > 0 ? acc.res*acc.subres : acc.res))},{sub:0,subres:0,res:1})}
calcDiffs(input)
