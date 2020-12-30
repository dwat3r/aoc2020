const util = require("util");
const fs = require("fs");
const fe = require("fast-equals");

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

let edges = (tile) => {
  let es = [
    tile.data[0],
    tile.data.map((tr) => tr[0]),
    tile.data[9],
    tile.data.map((tr) => tr[9]),
  ];
  return [...es, ...es.map((e) => reverse(e))];
};

let intersect = (arr1, arr2) =>
  arr1.filter((e) => arr2.some((ae) => fe.deepEqual(ae, e)));

let run = (input) => {
  let neighs = input.map((t) => ({
    name: t.name,
    neighs: input
      .filter(
        (ot) =>
          !fe.deepEqual(ot, t) && intersect(edges(ot), edges(t)).length > 0
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
let assemble = (input) => {
  let neighs = input.map((t) => ({
    name: t.name,
    neighs: input
      .filter(
        (ot) =>
          !fe.deepEqual(ot, t) && intersect(edges(ot), edges(t)).length > 0
      )
      .map((ot) => ot.name),
  }));
};
