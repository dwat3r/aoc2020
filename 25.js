const trampoline = (fn) => (...args) => { let result = fn(...args); while (typeof result === "function") { result = result(); } return result;};
//Part1
let test = `5764801
17807724`

let input = `2069194
16426071`

let lsize = trampoline(function rec(key ,i, di,sub,check,subb) {
	let nsub = (sub * subb) % 20201227
	return check? (nsub === key ? i : () => rec(key, i+1 ,di,nsub,check,subb)) : (i === di ? nsub : () => rec(key, i+1,di,nsub,check,subb))
})

let run = input => {
	let [n1,n2]= input.split("\n").filter(i=>i).map(i=>parseInt(i))
	console.log(n1,n2)
	let [ls1, ls2]=[n1,n2].map(n=>lsize(n,1,0,1,true,7))
	console.log(ls1,ls2)
	return lsize(1,1,ls1,1,false,n2)
}


console.log(run(input))
