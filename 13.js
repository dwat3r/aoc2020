let input = document.querySelector("pre").textContent.split("\n").filter(i => i)
// first part
let find = input => {let arrive = parseInt(input[0]);let schedule = input[1].split(",").filter(i=> i !== "x").map(i => parseInt(i));let {s,t} = schedule.map(s => ({s:s,t:(s -(arrive % s))})).reduce((acc,x)=>acc.t < x.t ? acc : x );return s*t;}
find(input)
// second part
