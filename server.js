const express = require("express");
const bodyParser = require("body-parser");
const R = require("ramda");
const conversationResolver = require("./lib/finance");
// const conversationResolver = require("./lib/send_money");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.post("/api/v1/clinc", (req, res) => {
  console.log(
    "XXXXXXXXXXXXXXXXX REQUEST DATA XXXXXXXXXXXXXXXXXXXX",
    JSON.stringify(req.body)
  );

  const resolved = conversationResolver(req.body);

  if (resolved) {
    console.log(
      "XXXXXXXXXXXXXXXXX RESPONSE DATA XXXXXXXXXXXXXXXXXXXX",
      JSON.stringify({ ...req.body, ...resolved })
    );
    res.send(JSON.stringify({ ...req.body, ...resolved }));
  } else {
    // Clinc ignores any 400-500 responses
    res.sendStatus(500);
  }
});

module.exports = {
  startServer: () => {
    app.listen(port, () => {
      console.log(`Clinc bizlo server is istening on port ${port}!`);
    });
  }
};
