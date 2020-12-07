let input = document.querySelector("body > pre").textContent.split(".\n");
// first part
let map = input
  .filter((i) => i !== "")
  .reduce(
    (map, i) => ({
      ...map,
      [i.match(/^\w+ \w+/)[0]]:
        i.indexOf("no") === -1
          ? i
              .slice(i.indexOf("contain") + 8)
              .split(", ")
              .map((i) => i.match(/^(\d+) (\w+ \w+)/).slice(1, 3))
          : [],
    }),
    {}
  );
let findShiny = (ss, mmap) => {
  let map = { ...mmap };
  let c = Object.entries(map).filter((kv) =>
    kv[1].some((cb) => ss.includes(cb[1]))
  );
  c.forEach((kv) => delete map[kv[0]]);
  if (c.length === 0) {
    return 0;
  } else {
    return (
      c.length +
      findShiny(
        c.map((kv) => kv[0]),
        { ...map }
      )
    );
  }
};
findShiny(["shiny gold"], map);
// second part
let countShiny = (ss, mmap) => {
  let map = { ...mmap };
  if (map[ss].length === 0) {
    return 0;
  } else {
    return map[ss]
      .map(
        (cb) =>
          parseInt(cb[0]) + parseInt(cb[0]) * countShiny(cb[1], { ...map })
      )
      .reduce((acc, x) => acc + x);
  }
};
countShiny("shiny gold", map);
