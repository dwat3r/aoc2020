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
      let [sname, ...sdatas] = tile.split("\n");
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
  {name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[tile.data.length-1-y][x])) }, // rot 90
  {name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[tile.data.length-1-x][tile.data.length-1-y])) }, // rot 180
  {name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[y][tile.data.length-1-x])) }, // rot 270
  {name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[x][tile.data.length-1-y])) }, // flip horizontal
  {name: tile.name, data: tile.data.map((tr, x)=> tr.map((_, y)=> tile.data[tile.data.length-1-x][y])) }, // flip vertical
]

let ser = (x,y) => `${x},${y}`
let deser = xy => xy.split(",").filter(i=>i).map(i=>parseInt(i))

// todo iterate over input instead of grid, and check if remaining element fits on the already existing arranged puzzle
// todo: melysegi bejaras es megnezni hogy melyik configbol elerheto az osszes puzzle elem
let assemble = (input) => {
  let [t, ...tail] = input;
  let grid = new Map();
  grid.set(ser(0,0), t);
  return function rec(grid, input) {
    //console.log(vb([grid, input.map(t=>t.name)]))
    if (input.length === 0) return grid;
    let toRem = new Set();
    let ngrid = _.cloneDeep(grid);
    let neighs = [...grid.entries()].map(xygt => {
      return {
        gt: xygt, 
        neigh: input.flatMap(t=>transforms(t))
          .filter(t => intersect(edges(xygt[1]),edges(t)).length === 1)
      }
    })
    
    
    // let neighs = input.flatMap(t=>transforms(t)).map(t => {
    //   return [...grid.values()].filter(
    //     (gt) => intersect(edges(gt), edges(t)).length > 0
    //   ).length > 0
      // transforms(t).filter(nt=> {
      //   gneighs.some(xygt)
      // })

      

      // if (!grid.has(ser(x+1, y))) neigh.filter(nt => fe.deepEqual(right(t),left(nt))).forEach(nt=> {ngrid.set(ser(x+1, y), nt);toRem.add(nt.name)})
      // if (!grid.has(ser(x-1, y))) neigh.filter(nt => fe.deepEqual(left(t),right(nt))).forEach(nt=> {ngrid.set(ser(x-1, y), nt);toRem.add(nt.name)})
      // if (!grid.has(ser(x, y+1))) neigh.filter(nt => fe.deepEqual(top(t),bottom(nt))).forEach(nt=> {ngrid.set(ser(x, y+1), nt);toRem.add(nt.name)})
      // if (!grid.has(ser(x, y-1))) neigh.filter(nt => fe.deepEqual(bottom(t),top(nt))).forEach(nt=> {ngrid.set(ser(x, y-1), nt);toRem.add(nt.name)})
    
    return rec(ngrid, input.filter((e) => ![...toRem.values()].some((ae) => fe.deepEqual(ae, e.name))));
  }(grid, tail)
};

//console.log(vb(run(parse(input))));
// todo it works for test but not for input
console.log(vb(assemble(parse(input))));