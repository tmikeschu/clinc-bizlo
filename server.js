const express = require("express");
const bodyParser = require("body-parser");
const R = require("ramda");
const { slotLens, headLens, tailLens } = require("./lenses");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

const logSlotAndState = R.pipe(
  R.pick(["state", "slots"]),
  JSON.stringify,
  console.log
);

const headTail = R.juxt([R.head, R.tail]);

const capitalize = R.pipe(
  headTail,
  R.over(headLens, R.toUpper),
  R.join("")
);

const camelize = R.pipe(
  R.split(" "),
  headTail,
  R.over(
    tailLens,
    R.pipe(
      R.map(capitalize),
      R.join("")
    )
  ),
  R.join("")
);

const camelizeArgs = R.evolve({
  slots: R.evolve({
    _ARGUMENTS_: R.evolve({
      values: R.map(
        R.evolve({
          tokens: camelize,
          resolved: R.always(1)
        })
      )
    })
  })
});

const resolvedLens = R.lensProp("resolved");

const resolveValues = R.evolve({
  slots: R.mapObjIndexed(
    R.evolve({
      values: R.map(R.set(resolvedLens, 1))
    })
  )
});

app.post("/clinc-bizlo", (req, res) => {
  R.pipe(
    R.prop("body"),
    R.tap(logSlotAndState),
    camelizeArgs,
    resolveValues,
    JSON.stringify,
    res.send.bind(res)
  )(req);
});

module.exports = {
  startServer: () => {
    app.listen(port, () => {
      console.log(`Clinc bizlo server is istening on port ${port}!`);
    });
  }
};
