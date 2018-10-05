const R = require("ramda");

// Str -> [Char, Str]
// OR
// [a] -> [a, [a]]
const headTail = R.juxt([R.head, R.tail]);

module.exports = {
  headTail
};
