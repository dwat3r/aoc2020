let input = document.querySelector("pre").textContent.split("\n").filter(i => i !== "").map(i => {let [_,d,n] = i.match(/^(\w)(\d+)$/);return ({d:d,n:parseInt(n)})})
// first part
let move = (p,d) => {let moves = {...p,[d.d]:p[d.d]+d.n};let rdirs = ["W","N","E","S"];let ldirs = ["S","E","N","W"];let turns = {"F":{...p,[p.H]:p[p.H]+d.n},"R":{...p,H:rdirs[(rdirs.indexOf(p.H) + (d.n / 90)) % 4]},"L":{...p,H:ldirs[(ldirs.indexOf(p.H) + (d.n / 90)) % 4]}};return rdirs.includes(d.d) ? moves : turns[d.d];}
let sail = input => input.reduce((p,d) => move(p,d),{E:0,W:0,N:0,S:0,H:"E"})
let {E,W,N,S} = sail(input);Math.abs(E-W) + Math.abs(N-S)
// second part
