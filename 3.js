const input = document.querySelector("body > pre").textContent.split('\n').map(i => i.split(""))
// first part
input.reduce((acc, i) => ({x: ((acc.x + 3) % 31), res: (acc.res + (i[acc.x] === "#" ? 1 : 0))}), {x: 0,res: 0})
// second part
