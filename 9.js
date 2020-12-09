let input = document
  .querySelector("body > pre")
  .textContent.split("\n")
  .filter((i) => i)
  .map((i) => parseInt(i));
// first part
let findInvalid = (input, ix, n) => {
  let is = input.slice(ix, ix + n);
  return is
    .flatMap((i) =>
      is.filter((j) => j !== i).map((j) => i + j === input[ix + n])
    )
    .some((i) => i)
    ? findInvalid(input, ix + 1, n)
    : input[ix + n];
};
findInvalid(input, 0, 25);
// second part
let findInvalid = (input, ix, n) => {
  let is = input.slice(ix, ix + n);
  return is
    .flatMap((i) =>
      is.filter((j) => j !== i).map((j) => i + j === input[ix + n])
    )
    .some((i) => i)
    ? findInvalid(input, ix + 1, n)
    : { ix: ix, value: input[ix + n] };
};
let findWeakness = (input, invalid, ix, n) => {
  let is = input.slice(ix, n);
  let s = is.reduce((acc, x) => acc + x);
  return s === invalid.value
    ? Math.min(...is) + Math.max(...is)
    : s < invalid.value
    ? findWeakness(input, invalid, ix, n + 1)
    : findWeakness(input, invalid, ix + 1, n);
};
let invalid = findInvalid(input, 0, 25);
findWeakness(input, invalid, 0, 1);
