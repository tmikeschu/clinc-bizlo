const R = require("ramda");
const { camelize } = require("./stringUtils");

// Obj -> Obj
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

// Obj -> Obj
const resolveValues = R.evolve({
  slots: R.mapObjIndexed(
    R.evolve({
      values: R.map(R.set(R.lensProp("resolved"), 1))
    })
  )
});

// Obj -> Void(IO)
const logSlotAndState = R.pipe(
  R.pick(["state", "slots"]),
  JSON.stringify
);

// Obj -> Obj
const resolveSlots = R.pipe(
  R.tap(logSlotAndState),
  camelizeArgs,
  resolveValues
);

module.exports = {
  resolveSlots
};
