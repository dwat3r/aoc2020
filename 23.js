var util = require("util");
var LinkedList = require("circular-list");
let test = `389125467`;
let input = `394618527`;
// part1
let parse = (input) => [...input].map((i) => parseInt(i));

let max = (cups) => cups.reduce((acc, x) => (acc > x ? acc : x));
let min = (cups) => cups.reduce((acc, x) => (acc < x ? acc : x));

let findDest = (cups, current) => {
  // console.log("findDest",current)
  if (isNaN(current)) throw Error("NaN!");
  if (current < min(cups)) {
    current = max(cups) + 1;
  }
  let found = cups.findIndex((cup) => current - 1 === cup);
  return found === -1 ? findDest(cups, current - 1) : found;
};

let shuffle = (cups) => {
  let l = cups.length;
  return (function rec(cups, current, turns) {
    //  console.log("---")
    if (turns === 100) return cups;
    let ci = cups.indexOf(current);
    let pickdup = cups.concat(cups).slice(ci + 1, ci + 4);
    let ncups = cups.filter(
      (_, ix) => ![1, 2, 3].some((i) => (ci + i) % l === ix)
    );
    let dest = findDest(ncups, ncups[ncups.indexOf(current)]);
    ncups.splice(dest + 1, 0, ...pickdup);
    // console.log(util.inspect([cups, current, pickdup, ncups[dest]], {compact : true, colors: true}))
    return rec(ncups, ncups[(ncups.indexOf(current) + 1) % l], turns + 1);
  })(cups, cups[0], 0);
};

let stringify = (cups) =>
  cups
    .concat(cups)
    .slice(cups.indexOf(1) + 1, cups.indexOf(1) + cups.length)
    .join("");

//console.log(stringify(shuffle(parse(test))))
//console.log(stringify(shuffle(parse(input))))
//part2

let toLinked = (arr) => {
  let ll = new LinkedList();
  arr.forEach((x) => ll.append(new LinkedList.Node(x)));
  return ll;
};

let lfind = (ll, destVal) => {
  var n = ll.first;
  while (true) {
    if (n === null) return null;
    if (n.data === destVal) return n;
    else {
      n = n.next;
    }
  }
};
let linsert = (ll, n, arr) => {
  var ne;
  var nn;
  while (arr.length > 0) {
    ne = arr.shift();
    ll.insert(n, ne);
    n = ne;
  }
};
// returns sliced in an array, and removes the sliced
let lslice = (ll, n, amount) => {
  var c = 0;
  var ret = [];
  while (c !== amount) {
    ret.push(n);
    var temp = n.next;
    ll.remove(n);
    n = temp;
    c++;
  }
  return ret;
};
let toArr = (ll) => {
  var c = 0;
  var ret = [];
  var n = ll.first;
  while (c !== ll.length) {
    ret.push(n.data);
    n = n.next;
    c++;
  }
  return ret;
};
let toMap = (ll) => {
  var c = 0;
  var ret = new Map();
  var n = ll.first;
  while (c !== ll.length) {
    ret.set(n.data, n);
    n = n.next;
    c++;
  }
  return ret;
};

let lfindDest = (cups, currentNode, pickdup, memo, length) => {
  // console.log("findDest",current)
  var destVal = currentNode.data - 1 === 0 ? length : currentNode.data - 1;
  while (pickdup.some(n=>n.data === destVal)) {
    destVal--;
    if (destVal < 1) {
      destVal = length;
    }
  }
 return memo.get(destVal);
};

let parse2 = (input) => {
  let nums = Array(1000001)
    .fill(1)
    .map((_, ix) => ix)
    .slice(10);

  let orig = [...input].map((i) => parseInt(i));
  let i = orig.indexOf(max(orig));
  return toLinked([...orig, ...nums]);
};

let shuffle2 = (cups) => {
  var current = cups.first;
  var l = cups.length;
  var turns = 0;
  let memo = toMap(cups)
  while (true) {
    //console.log("---")
    //if(turns%1000000===0) console.log(turns, current.data, toArr(cups));
    if (turns === 10000000) return cups;
    let pickdup = lslice(cups, current.next, 3);
    let dest = lfindDest(cups, current, pickdup, memo, l);
    linsert(cups, dest, pickdup);
    //console.log(util.inspect([toArr(cups), current.data, pickdup.map(n=>n.data), dest.data], {compact : true, colors: true}))
    current = current.next;
    turns++;
  }
};

let getStars = (cups) => {
  let i1 = lfind(cups, 1);
  console.log(i1.data, i1.next.data, i1.next.next.data)
  return i1.next.data * i1.next.next.data;
};

//console.log(toArr(shuffle2(toLinked(parse(test)))))
let ret = shuffle2(parse2(input));
console.log(toArr(ret));
console.log(getStars(ret));
