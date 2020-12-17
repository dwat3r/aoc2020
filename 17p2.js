// part 2
let test = `.#.
..#
###`;

// let draw = grid => {
//   let sgrid.a.entries().
// }

let h = (x, y, z, w) => `${x},${y},${z},${w}`;
let unh = (str) => {
  let [_, x, y, z, w] = str.match(/(\-?\d+),(\-?\d+),(\-?\d+),(\-?\d+)/);
  return [parseInt(x), parseInt(y), parseInt(z), parseInt(w)];
};

let range = (l, h) => [...Array(Math.abs(h-l)+1).keys()].map((i) => i + l);

let parse = (input) =>
  input
    .split("\n")
    .filter((i) => i)
    .reduce(
      (res, is) => {
        [...is].forEach((ys, y) =>
          ys === "#"
            ? res.a.set(h(y, res.h, 0,0), true)
            : res.a.set(h(y, res.h, 0,0), false)
        );
        return { l: 0, h: res.h + 1, a: res.a };
      },
      { a: new Map(), h: 0, l: 0 }
    );

let neigh = (x, y, z, w) =>
  [x - 1, x, x + 1]
    .flatMap((x) =>
      [y - 1, y, y + 1].flatMap((y) => 
      [z - 1, z, z + 1]
      .flatMap(z => [
        h(x, y, z, w-1),
        h(x, y, z, w),
        h(x, y, z, w+1),
      ]))
    )
    .filter((n) => n != h(x, y, z,w));

let field = (lo, hi) => {
  let r = range(lo - 1, hi + 1);
  return r.flatMap((x) => r.flatMap((y) => r.flatMap((z) => r.map(w => h(x, y, z, w)))));
};

let cycle = (grid) => {
  let ngrid = new Map();
  field(grid.l,grid.h).forEach(c => {
    let an = neigh(...unh(c)).filter((c) => grid.a.has(c) && grid.a.get(c)).length;
    let act = grid.a.has(c) && grid.a.get(c)
    //if(c==="0,1,-1") {console.log(neigh(...unh(c)).map(c => [c,grid.a.get(c)]),c,act)}
    if ((act && (an === 2 || an === 3)) || 
        (!act && an === 3)) {
      ngrid.set(c, true);
    } else {
      ngrid.set(c, false);
    }
  });
  return ({l:grid.l -1, h: grid.h +1, a: ngrid});
};

let input = `..#..##.
#.....##
##.#.#.#
..#...#.
.###....
######..
.###..#.
..#..##.`

let res = [...cycle(cycle(cycle(cycle(cycle(cycle(parse(input))))))).a.values()].filter(c=>c).length
//console.log(parse(test))
console.log(res);


