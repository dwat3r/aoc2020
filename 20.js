const util = require("util");
const fs = require("fs");
const fe = require("fast-equals");
const _ = require("lodash");

let test = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;

let input = fs.readFileSync("20.txt", "utf8");

let parse = (input) =>
  input
    .split("\n\n")
    .filter((i) => i)
    .map((tile) => {
      let [sname, ...sdatas] = tile.split("\n").filter(i=>i);
      let [_, name] = sname.match(/^Tile (\d+):$/);
      let data = sdatas.map((sdata) => [...sdata]);
      return { name: name, data: data };
    });

// first part
let reverse = (arr) => {
  let ret = [...arr];
  return ret.reverse();
};

let edgesRF = (tile) => {
  let es = [
    tile.data[0],
    tile.data.map((tr) => tr[0]),
    tile.data[9],
    tile.data.map((tr) => tr[9]),
  ];
  return [...es, ...es.map((e) => reverse(e))];
};

let edges = (tile) => {
  let es = [
    tile.data[0],
    tile.data.map((tr) => tr[0]),
    tile.data[9],
    tile.data.map((tr) => tr[9]),
  ];
  return es
};

let intersect = (arr1, arr2) =>
  arr1.filter((e) => arr2.some((ae) => fe.deepEqual(ae, e)));

let run = (input) => {
  let neighs = input.map((t) => ({
    name: t.name,
    neighs: input
      .filter(
        (ot) =>
          !fe.deepEqual(ot, t) && intersect(edgesRF(ot), edgesRF(t)).length > 0
      )
      .map((ot) => ot.name),
  }));
  return neighs
    .filter(
      (t) =>
        t.neighs.length === 2 &&
        t.neighs
          .flatMap((nt) => neighs.filter((n) => n.name === nt))
          .filter((tn) => tn.neighs.length === 3).length === 2
    )
    .map((t) => parseInt(t.name))
    .reduce((a, x) => a * x);
};

let vb = (v) => util.inspect(v, { depth: null, colors: true, compact: true });
//console.log(vb(run(parse(input))));

// part 2

let left = tile => tile.data.map(tv => tv[0])
let right = tile => tile.data.map(tv => tv[9])
let top = tile => tile.data[0]
let bottom = tile => tile.data[9]

let transforms = tile => [
  tile,
  rot90(tile),
  rot180(tile),
  rot270(tile),
  fliph(tile), 
  flipv(tile),
  flipv(rot270(tile)),
  fliph(rot270(tile))
]

let rot90  = tile =>  ({name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[tile.data.length-1-y][x])) })
let rot180 = tile =>  ({name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[tile.data.length-1-x][tile.data.length-1-y])) })
let rot270 = tile =>  ({name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[y][tile.data.length-1-x])) })
let fliph  = tile =>  ({name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[x][tile.data.length-1-y])) })
let flipv  = tile =>  ({name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[tile.data.length-1-x][y])) })
  

let ser = (x,y) => `${x},${y}`
let deser = xy => xy.split(",").filter(i=>i).map(i=>parseInt(i))

// todo iterate over input instead of grid, and check if remaining element fits on the already existing arranged puzzle
// todo: melysegi bejaras es megnezni hogy melyik configbol elerheto az osszes puzzle elem
// collect neighbours to sides of grid tiles, and remove tile if it found to be incompatible with the others.
let assemble = (input) => {
  let [t, ...tail] = input.flatMap(t=>transforms(t));
  let grid = new Map();
  grid.set(ser(0,0), t);
  return function rec(grid, input) {
    //console.log(vb([grid, input.map(t=>t.name)]))
    if (input.length === 0) return grid;
    let toRem = new Set();
    let ngrid = _.cloneDeep(grid);
    
    grid.forEach((t, xy) => {
      let [x,y] = deser(xy)
      let neigh = input.filter(nt => intersect(edges(t), edges(nt)).length > 0)

      if (!grid.has(ser(x+1, y))) neigh.filter(nt => fe.deepEqual(right(t),left(nt))).forEach(nt=> {ngrid.set(ser(x+1, y), nt);toRem.add(nt.name)})
      if (!grid.has(ser(x-1, y))) neigh.filter(nt => fe.deepEqual(left(t),right(nt))).forEach(nt=> {ngrid.set(ser(x-1, y), nt);toRem.add(nt.name)})
      if (!grid.has(ser(x, y+1))) neigh.filter(nt => fe.deepEqual(top(t),bottom(nt))).forEach(nt=> {ngrid.set(ser(x, y+1), nt);toRem.add(nt.name)})
      if (!grid.has(ser(x, y-1))) neigh.filter(nt => fe.deepEqual(bottom(t),top(nt))).forEach(nt=> {ngrid.set(ser(x, y-1), nt);toRem.add(nt.name)})
    });
    return rec(ngrid, input.filter((e) => ![...toRem.values()].some((ae) => fe.deepEqual(ae, e.name))));
  }(grid, tail)
};

let draw = grid => {
  let sorted = [...grid.entries()].sort((x,y)=> {
    let [x1,y1] = deser(x[0]);
    let [x2,y2] = deser(y[0]);
    return (x1 - x2)
  }).sort((x,y)=> {
    let [x1,y1] = deser(x[0]);
    let [x2,y2] = deser(y[0]);
    return (y2 - y1)
  })
  let wide = Math.sqrt(sorted.length)
  let long = sorted[0][1].data.length
  let [start] = deser(sorted[0][0])
  let ret = sorted.reduce((acc, t, ix)=> {
    acc[ix%wide]
  },[])
  return ret;
}

//console.log(vb(run(parse(input))));
// todo it works for test but not for input
console.log(vb(draw(assemble(parse(input)))));