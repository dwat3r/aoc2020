const input = document.querySelector("pre").textContent.split("\n\n")
// first part
input.map(i => i.split("").filter(i => i.match(/[a-z]/)).reduce((set,x)=>set.add(x),new Set()).size).reduce((acc,x)=>acc+x)
// second part
input.map(i => i.split("\n").filter(i => i.length !== 0).map(i => [...i]).reduce((acc,x)=>acc.filter(i => x.includes(i))).length).reduce((acc,x)=>acc+x)
