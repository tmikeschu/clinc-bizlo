const express = require("express");
const bodyParser = require("body-parser");
const R = require("ramda");
const { resolveSlots } = require("./lib/slot_resolver");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.post("/clinc-bizlo", (req, res) => {
  R.pipe(
    R.prop("body"),
    resolveSlots,
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
