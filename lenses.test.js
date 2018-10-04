const test = require("tape");
const R = require("ramda");

const data = require("./mock.json");
const L = require("./lenses");

test("slotLens provides a lens for a slot name", t => {
  t.plan(2);

  const lens = L.slotLens("_ACCOUNT_TO_");

  R.pipe(
    R.tap(
      R.pipe(
        R.view(lens),
        R.prop("values"),
        R.map(R.prop("tokens")),
        R.head,
        h => t.equal(h, "credit card")
      )
    ),
    R.tap(
      R.pipe(
        R.over(
          lens,
          R.evolve({
            values: R.over(L.headLens, R.evolve({ resolved: R.always(1) }))
          })
        ),
        R.view(lens),
        R.prop("values"),
        R.head,
        R.prop("resolved"),
        x => t.equal(x, 1)
      )
    )
  )(data.post);
});
