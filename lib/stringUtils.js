const R = require("ramda");
const { headTail } = require("./listUtils");

// Str -> Str
const capitalize = R.pipe(
  headTail,
  R.over(R.lensIndex(0), R.toUpper),
  R.join("")
);

// Str -> Str
const camelize = R.pipe(
  R.split(" "),
  headTail,
  R.over(
    R.lensIndex(1),
    R.pipe(
      R.map(capitalize),
      R.join("")
    )
  ),
  R.join("")
);

module.exports = {
  camelize,
  capitalize
};
