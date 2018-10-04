const R = require("ramda");

const slotsPath = ["slots"];

const slotLens = R.pipe(
  R.of,
  R.concat(slotsPath),
  R.lensPath
);

const headLens = R.lensIndex(0);
const tailLens = R.lensIndex(1);

module.exports = {
  slotLens,
  headLens,
  tailLens
};
