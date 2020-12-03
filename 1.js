const input = document.querySelector("body > pre").textContent
const inp = input.split('\n')
let inn = inp.map(s => parseInt(s))
// first part
inn.flatMap(a => inn.filter(b => a !== b).map(b => [a + b, a*b])).filter(xy => xy[0] === 2020)
// second part
inn.flatMap(a => inn.flatMap(b => inn.map(c => [a + b + c, a*b*c]))).filter(xy => xy[0] === 2020)
