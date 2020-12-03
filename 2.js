const input = document.querySelector("body > pre").textContent.split('\n')
// first part
input.map(i => i.match(/(\d+)-(\d+)\s+([a-z]):\s+([a-z]+)/)).filter(x => x !== null).filter(i => {let [x,from,to,c,passw] = i;let l = passw.split("").filter(p => p === c).length; return l >= parseInt(from) && l <= parseInt(to)}).length
// second part
input.map(i => i.match(/(\d+)-(\d+)\s+([a-z]):\s+([a-z]+)/)).filter(x => x !== null).filter(i => {let [x,from,to,c,passw] = i;let a = passw.split("")[parseInt(from)-1] === c; let b = passw.split("")[parseInt(to)-1] === c;return a ? !b : b}).length
