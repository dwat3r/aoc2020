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
let input = document
  .querySelector("pre")
  .textContent.split("\n")
  .filter((i) => i !== "")
  .map((i) => {
    let [_, d, n] = i.match(/^(\w)(\d+)$/);
    return { d: d, n: parseInt(n) };
  });
// first part
let move = (p, d) => {
  let moves = { ...p, [d.d]: p[d.d] + d.n };
  let rdirs = ["W", "N", "E", "S"];
  let ldirs = ["S", "E", "N", "W"];
  let turns = {
    F: { ...p, [p.H]: p[p.H] + d.n },
    R: { ...p, H: rdirs[(rdirs.indexOf(p.H) + d.n / 90) % 4] },
    L: { ...p, H: ldirs[(ldirs.indexOf(p.H) + d.n / 90) % 4] },
  };
  return rdirs.includes(d.d) ? moves : turns[d.d];
};
let sail = (input) =>
  input.reduce((p, d) => move(p, d), { E: 0, W: 0, N: 0, S: 0, H: "E" });
let { E, W, N, S } = sail(input);
Math.abs(E - W) + Math.abs(N - S);
// second part
let turn = (h, dir, deg) => {
  let ldirs = ["W", "N", "E", "S"];
  let rdirs = ["S", "E", "N", "W"];
  return dir === "R"
    ? rdirs[(rdirs.indexOf(h) + deg / 90) % 4]
    : ldirs[(ldirs.indexOf(h) + deg / 90) % 4];
};
let move = (ip, d) => {
  let p = deepCopy(ip);
  let moves = { ...p, wp: { ...p.wp, [d.d]: p.wp[d.d] + d.n } };
  let turns = {
    F: {
      ...p,
      s: {
        ...p.s,
        E: p.s.E + p.wp.E * d.n,
        W: p.s.W + p.wp.W * d.n,
        S: p.s.S + p.wp.S * d.n,
        N: p.s.N + p.wp.N * d.n,
      },
    },
    R: {
      ...p,
      wp: {
        W: p.wp[turn("W", "R", d.n)],
        N: p.wp[turn("N", "R", d.n)],
        E: p.wp[turn("E", "R", d.n)],
        S: p.wp[turn("S", "R", d.n)],
      },
    },
    L: {
      ...p,
      wp: {
        S: p.wp[turn("S", "L", d.n)],
        E: p.wp[turn("E", "L", d.n)],
        N: p.wp[turn("N", "L", d.n)],
        W: p.wp[turn("W", "L", d.n)],
      },
    },
  };
  return rdirs.includes(d.d) ? moves : turns[d.d];
};
let sail = (input) =>
  input.reduce(
    (p, d) => {
      console.log(p, d);
      return move(p, d);
    },
    { wp: { E: 10, W: 0, N: 1, S: 0 }, s: { E: 0, W: 0, N: 0, S: 0 } }
  );
let ret = sail(input);
Math.abs(ret.s.E - ret.s.W) + Math.abs(ret.s.N - ret.s.S);
