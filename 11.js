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
let isEqual = (arr1, arr2) =>
  arr1.every((r, x) => r.every((v, y) => arr2[x][y] === v));

let input = document
  .querySelector("body > pre")
  .textContent.split("\n")
  .filter((i) => i)
  .map((i) => [...i]);

// first part
let flip = (it, s, x, y) => {
  let nbs = [
    [x - 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
    [x + 1, y],
    [x + 1, y - 1],
    [x, y - 1],
    [x - 1, y - 1],
  ];
  return s === "L"
    ? nbs.filter((xy) => it[xy[0]] !== undefined && it[xy[0]][xy[1]] === "#")
        .length === 0
    : s === "#"
    ? nbs.filter((xy) => it[xy[0]] !== undefined && it[xy[0]][xy[1]] === "#")
        .length >= 4
    : false;
};
let round = (it) => {
  let t = deepCopy(it);
  it.forEach((r, x) =>
    r.forEach((s, y) => {
      if (flip(it, s, x, y)) {
        t[x][y] = s === "L" ? "#" : "L";
      }
    })
  );
  return t;
};
let fix = (it) => {
  let nt = round(it);
  return isEqual(nt, it) ? it : fix(nt);
};
fix(input)
  .flat()
  .filter((s) => s === "#").length;
// second part
let findSeat = (it, xy, dir) => {
  let [x2, y2] = dir(...xy);
  return it[x2] === undefined || it[x2][y2] === undefined
    ? false
    : it[x2][y2] !== "."
    ? it[x2][y2]
    : findSeat(it, [x2, y2], dir);
};
let flip = (it, s, x, y) => {
  let dirs = [
    (x, y) => [x - 1, y],
    (x, y) => [x - 1, y + 1],
    (x, y) => [x, y + 1],
    (x, y) => [x + 1, y + 1],
    (x, y) => [x + 1, y],
    (x, y) => [x + 1, y - 1],
    (x, y) => [x, y - 1],
    (x, y) => [x - 1, y - 1],
  ];
  let nbs = dirs.map((dir) => findSeat(it, [x, y], dir));
  return s === "L"
    ? nbs.filter((nb) => nb && nb === "#").length === 0
    : s === "#"
    ? nbs.filter((nb) => nb && nb === "#").length >= 5
    : false;
};
fix(input)
  .flat()
  .filter((s) => s === "#").length;
