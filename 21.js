// part 1
let test = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;

let parse = (input) =>
  input
    .split("\n")
    .filter((i) => i)
    .map((input) => {
      let [singrs, sallergs] = input.split("(contains ");
      let ingrs = singrs.split(" ").filter((i) => i);
      let allergs = sallergs.split(", ").filter((i) => i);
      allergs[allergs.length - 1] = allergs[allergs.length - 1].substring(
        0,
        allergs[allergs.length - 1].length - 1
      );
      return { ingrs: ingrs, allergs: allergs };
    });

let intersect = (arr1, arr2) => arr1.filter((e) => arr2.includes(e));
let difference = (arr1, arr2) => arr1.filter((e) => !arr2.includes(e));
let union = (arr1, arr2) => arr1.concat(difference(arr2, arr1));

let listAllergs = (input) => {
  let allergs = input.reduce((acc, x) => {
    let nallergs = x.allergs.reduce(
      (o, allerg) => ({
        ...o,
        [allerg]: acc[allerg] ? intersect(acc[allerg], x.ingrs) : x.ingrs,
      }),
      {}
    );
    return { ...acc, ...nallergs };
  }, {});
  return allergs;
};

let run = (input) => {
  let allergList = [
    ...Object.values(listAllergs).reduce((set, x) => {
      x.forEach((x) => set.add(x));
      return set;
    }, new Set()),
  ];

  let counts = input.reduce((acc, x) => {
    let nonAllergs = difference(x.ingrs, allergList).reduce(
      (o, ingr) => ({ ...o, [ingr]: acc[ingr] ? acc[ingr] + 1 : 1 }),
      {}
    );
    return { ...acc, ...nonAllergs };
  }, {});
  return Object.values(counts).reduce((acc, x) => acc + x);
};
console.log(parse(test));
console.log(run(parse(test)));
// part 2
// resolve allergens by uniqueness, start by the least ambigous one, then reduce the problem by it.
let run2 = (input) => {
  let allergList = listAllergs(input);
  let unique = function rec(allergList) {
    let [h, ...tail] = [...Object.keys(allergList)].sort(
      (x, y) => allergList[x].length - allergList[y].length
    );
    if (tail.length === 0) return allergList;
    let filtered = tail.reduce((o, allerg) => {
            return ({...o,[allerg]:difference(allergList[allerg], allergList[h])})
          }, {});
    return ({[h]:allergList[h],...rec(filtered)})
  }(allergList);

  return [...Object.keys(unique)].sort().map(k=>unique[k]).join(",")
};

console.log(run2(parse(input)));
