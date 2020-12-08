let input = document
  .querySelector("body > pre")
  .textContent.split("\n")
  .filter((i) => i !== "");
// first part
let program = input.map((i) => {
  let [x, inst, n] = i.match(/(acc|nop|jmp)\s(\+\d+|-\d+)/);
  return { inst: inst, n: parseInt(n) };
});
let run = (pr, ip, visited, acc) =>
  visited.has(ip)
    ? acc
    : pr[ip].inst === "jmp"
    ? run(pr, ip + pr[ip].n, visited.add(ip), acc)
    : pr[ip].inst === "acc"
    ? run(pr, ip + 1, visited.add(ip), acc + pr[ip].n)
    : run(pr, ip + 1, visited.add(ip), acc);
run(program, 0, new Set(), 0);
// second part
// i needed a freaking deepCopy for this :D
const deepCopy = (inObject) => {
  let outObject, value, key;
  if (typeof inObject !== "object" || inObject === null) {
    return inObject;
  }
  outObject = Array.isArray(inObject) ? [] : {};
  for (key in inObject) {
    value = inObject[key];
    outObject[key] = deepCopy(value);
  }
  return outObject;
};
let run = (pr, ip, visited, acc) => {
  return ip === pr.length
    ? { inf: false, acc: acc }
    : visited.has(ip)
    ? { inf: true, acc: acc }
    : pr[ip].inst === "jmp"
    ? run(pr, ip + pr[ip].n, visited.add(ip), acc)
    : pr[ip].inst === "acc"
    ? run(pr, ip + 1, visited.add(ip), acc + pr[ip].n)
    : run(pr, ip + 1, visited.add(ip), acc);
};
let fix = (ipr, ix) => {
  let pr = deepCopy(ipr);
  if (pr[ix].inst === "jmp") {
    pr[ix].inst = "nop";
  } else if (pr[ix].inst === "nop") {
    pr[ix].inst = "jmp";
  } else {
    return fix(ipr, ix - 1);
  }
  let r = run(pr, 0, new Set(), 0);
  return r.inf ? fix(ipr, ix - 1) : r.acc;
};
fix(program,program.length - 1);
