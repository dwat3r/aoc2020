// first part
let input = document
  .querySelector("body > pre")
  .textContent.split("\n")
  .filter((i) => i);

let test = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`.split("\n");

let d2b = (v) => {
  let d = 2n << 34n;
  let bv = "";
  while (d != 0n) {
    bv = bv + v / d;
    v = v % d;
    d = d >> 1n;
  }
  return bv;
};
let b2d = (bv) =>
  [...bv].reduce(
    (acc, x) => ({ m: acc.m >> 1n, v: acc.v + acc.m * BigInt(parseInt(x)) }),
    { m: 2n << 34n, v: 0n }
  ).v;
let maskv = (mask, v) =>
  b2d([...d2b(v)].map((bv, ix) => (mask[ix] !== "X" ? mask[ix] : bv)).join(""));

let run = (input) => {
  let { mem } = input.reduce(
    (prog, inst) => {
      console.log(prog, inst);
      if (/^mask/.test(inst)) {
        return { ...prog, mask: inst.match(/^mask = ([X01]+)$/)[1] };
      } else {
        let [_, ix, v] = inst.match(/^mem\[(\d+)\] = (\d+)/);
        prog.mem[ix] = maskv(prog.mask, BigInt(parseInt(v)));
        return { ...prog, mem: prog.mem };
      }
    },
    { mask: "", mem: {} }
  );
  return Object.keys(mem).reduce(
    (acc, x) => (mem[x] !== undefined ? acc + mem[x] : acc),
    0n
  );
};


// second part
let maskv = (mask, v) =>
  [...d2b(v)].reduce(
    (acc, bv) =>
      mask[acc.ix] === "0"
        ? { bvs: acc.bvs.map((bbv) => bbv + bv), ix: acc.ix + 1 }
        : mask[acc.ix] === "1"
        ? { bvs: acc.bvs.map((bbv) => bbv + "1"), ix: acc.ix + 1 }
        : {
            bvs: ["0", "1"].flatMap((nbv) => acc.bvs.map((bbv) => bbv + nbv)),
            ix: acc.ix + 1,
          },
    { bvs: [""], ix: 0 }
  ).bvs;
let run = (input) => {
  let { mem } = input.reduce(
    (prog, inst) => {
      console.log(prog, inst);
      if (/^mask/.test(inst)) {
        return { ...prog, mask: inst.match(/^mask = ([X01]+)$/)[1] };
      } else {
        let [_, ix, v] = inst.match(/^mem\[(\d+)\] = (\d+)/);
        maskv(prog.mask, BigInt(parseInt(ix))).forEach(
          (ix) => (prog.mem[ix] = BigInt(parseInt(v)))
        );
        return { ...prog, mem: prog.mem };
      }
    },
    { mask: "", mem: {} }
  );
  return Object.keys(mem).reduce(
    (acc, x) => (mem[x] !== undefined ? acc + mem[x] : acc),
    0n
  );
};
