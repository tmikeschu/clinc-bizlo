const R = require("ramda");

const slotsPath = ["body", "slots"];

const slotLens = R.pipe(
  R.of,
  R.concat(slotsPath),
  R.lensPath
);

const headLens = R.lensIndex(0);

module.exports = {
  slotLens,
  headLens
};
