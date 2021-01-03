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
wseweeenwnesenwwwswnew`

let test2 = `nwwswee`


let input = fs.readFileSync("24.txt", "utf8");
let vb = (v) => util.inspect(v, { depth: null, colors: true, compact: true, breakLength: 200 });

let parseLine = line => {
  return function rec(line) {
    if (line.length === 0) return [];
    let dir = ["e", "se", "sw", "w", "nw", "ne"].filter(dir=> line.startsWith(dir))[0]
    return [dir, ...rec(line.slice(dir.length))];
  }(line)
}

let parse = input => input.split("\n").filter(i=>i).map(line => parseLine(line))
// first part

let flip = line => line.reduce((acc, x)=> {
  switch(x) {
    case "e":  return {x: acc.x+1, y: acc.y};
    case "se": return {x: acc.x+0.5, y: acc.y-0.5};
    case "ne": return {x: acc.x+0.5, y: acc.y+0.5};
    case "w":  return {x:  acc.x-1, y: acc.y};
    case "nw": return {x: acc.x-0.5, y: acc.y+0.5};
    case "sw": return {x: acc.x-0.5, y: acc.y-0.5};
  }
}, {x: 0, y: 0})

let ser = pos => `${pos.x},${pos.y}`

let run = input => {
  let m = input.reduce((acc,line)=> {
    let flipped = ser(flip(line));
    return acc.set(
      flipped, 
      acc.has(flipped) ? acc.get(flipped) + 1 : 1
      )
  }, new Map());
  return [...m.entries()].filter(xyn=> xyn[1]%2===1).length
}

//console.log(vb(flip(parseLine(test2))))
console.log(vb(run(parse(input))))