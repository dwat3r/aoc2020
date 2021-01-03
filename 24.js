const util = require("util");
const fs = require("fs");
const fe = require("fast-equals");
const _ = require("lodash");

let test = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`;

let test2 = `nwwswee`;

let input = fs.readFileSync("24.txt", "utf8");
let vb = (v) =>
  util.inspect(v, {
    depth: null,
    colors: true,
    compact: true,
    breakLength: 200,
  });

let parseLine = (line) => {
  return (function rec(line) {
    if (line.length === 0) return [];
    let dir = ["e", "se", "sw", "w", "nw", "ne"].filter((dir) =>
      line.startsWith(dir)
    )[0];
    return [dir, ...rec(line.slice(dir.length))];
  })(line);
};

let parse = (input) =>
  input
    .split("\n")
    .filter((i) => i)
    .map((line) => parseLine(line));
// first part

let flip = (line) =>
  line.reduce(
    (acc, x) => {
      switch (x) {
        case "e":  return { x: acc.x + 1,   y: acc.y };
        case "se": return { x: acc.x + 0.5, y: acc.y - 0.5 };
        case "ne": return { x: acc.x + 0.5, y: acc.y + 0.5 };
        case "w":  return { x: acc.x - 1,   y: acc.y };
        case "nw": return { x: acc.x - 0.5, y: acc.y + 0.5 };
        case "sw": return { x: acc.x - 0.5, y: acc.y - 0.5 };
      }
    },
    { x: 0, y: 0 }
  );



let ser = (pos) => `${pos.x},${pos.y}`;
let deser = (str) => { 
  let [x,y] = str.split(",").map((p) => parseFloat(p));
  return {x: x, y: y}
}

let run = (input) => {
  let m = input.reduce((acc, line) => {
    let flipped = ser(flip(line));
    return acc.set(flipped, acc.has(flipped) ? acc.get(flipped) + 1 : 1);
  }, new Map());
  return [...m.entries()].filter((xyn) => xyn[1] % 2 === 1).length;
};

//console.log(vb(flip(parseLine(test2))))
//console.log(vb(run(parse(input))))

// part 2

let neighs = tile => [
  { x: tile.x + 1,   y: tile.y },
  { x: tile.x + 0.5, y: tile.y - 0.5 },
  { x: tile.x + 0.5, y: tile.y + 0.5 },
  { x: tile.x - 1,   y: tile.y },
  { x: tile.x - 0.5, y: tile.y + 0.5 },
  { x: tile.x - 0.5, y: tile.y - 0.5 },
]

let run2 = (input) => {
  let m = input.reduce((acc, line) => {
    let flipped = ser(flip(line));
    return acc.set(flipped, acc.has(flipped) ? acc.get(flipped) + 1 : 1);
  }, new Map());
  let tiles = new Set();
  // black tiles
  m.forEach((n,xy) => {if (n % 2 === 1) tiles.add(xy)});

  let end = function rec(tiles, n) {
    if(n === 2) return tiles;
    let ntiles = _.cloneDeep(tiles);
    let neighs = new Set();
    tiles.forEach((xy) => {
      let ns = neighs(deser(xy));
      let blacks = ns.filter(nxy => m.has(ser(nxy))).length
      if (blacks === 0 || blacks > 2){
        ntiles.delete(xy)
      }
      ns.forEach(nxy => {
        // whites
        if(!tiles.has(ser(nxy))){
          let blacks = neighs(nxy).filter(nnxy => tiles.has(ser(nnxy))).length
          if(blacks === 2) {
            ntiles.add(ser(nxy));
          }
        }
      })
    })
    return rec(ntiles, n+1);
  }(tiles, 0);
  return end;
};

console.log(vb(run2(parse(test))));
