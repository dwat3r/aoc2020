let input = document.querySelector("body > pre").textContent.split('\n').filter(i => i).map(i => parseInt(i))
// first part
let res = input.sort((x,y) => x - y).slice(1).reduce((acc,x) => ({c:x,d1: acc.d1 + (acc.c + 1 === x ? 1 : 0), d2: acc.d2 + (acc.c + 2 === x ? 1 : 0),d3: acc.d3 + (acc.c + 3 === x ? 1 : 0) }),{c:input[0],d1:0,d2:0,d3:0})
(res.d1 + 1) * (res.d3 + 1)
// second part
