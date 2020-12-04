const input = document.querySelector("body > pre").textContent.split("\n\n");
// first part
input.filter(
  (i) =>
    ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"].filter(
      (field) => i.indexOf(field) === -1
    ).length === 0
).length;
// second part
input.filter(
  (i) =>
    [
      {
        f: "byr",
        fn: (s) => {
          let y = parseInt(s);
          return y >= 1920 && y <= 2002;
        },
      },
      {
        f: "iyr",
        fn: (s) => {
          let y = parseInt(s);
          return y >= 2010 && y <= 2020;
        },
      },
      {
        f: "eyr",
        fn: (s) => {
          let y = parseInt(s);
          return y >= 2020 && y <= 2030;
        },
      },
      {
        f: "hgt",
        fn: (s) => {
          let h = s.match(/^(\d+)(in|cm)$/);
          return (
            h !== null &&
            (h[2] === "cm"
              ? parseInt(h[1]) >= 150 && parseInt(h[1]) <= 193
              : parseInt(h[1]) >= 59 && parseInt(h[1]) <= 76)
          );
        },
      },
      { f: "hcl", fn: (s) => /^#[0-9a-f]{6}$/.test(s) },
      {
        f: "ecl",
        fn: (s) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(s),
      },
      {
        f: "pid",
        fn: (s) => /^\d{9}$/.test(s),
      },
    ].filter((field) => {
      let ix = i.indexOf(field.f);
      return ix === -1 || !field.fn(i.slice(ix + 4).match(/[^\s]+/)[0]);
    }).length === 0
).length;
