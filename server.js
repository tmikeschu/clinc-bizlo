const express = require("express");
const bodyParser = require("body-parser");
const R = require("ramda");
const conversationResolver = require("./lib/finance");
// const conversationResolver = require("./lib/send_money");
const v2Resolver = require("./lib/v2");
const v3Resolver = require("./lib/v3");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
const log = (label, data) => {
  console.log(
    `XXXXXXXXXXXXXXXXX ${label.toUpperCase()} DATA XXXXXXXXXXXXXXXXXXXX`,
    JSON.stringify(data)
  );
};

app.post("/api/v1/clinc", (req, res) => {
  log("request", req.body);

  const resolved = conversationResolver(req.body);

  if (resolved) {
    const response = { ...req.body, ...resolved };
    log("response", response);
    res.send(JSON.stringify(response));
  } else {
    // Clinc ignores any 400-500 responses
    res.sendStatus(500);
  }
});

app.post("/api/v2/clinc", (req, res) => {
  log("request", req.body);

  const resolved = v2Resolver(req.body);

  if (resolved) {
    const response = { ...req.body, ...resolved };
    log("response", response);
    res.send(JSON.stringify(response));
  } else {
    // Clinc ignores any 400-500 responses
    res.sendStatus(500);
  }
});

app.post("/api/v3/clinc", (req, res) => {
  log("request", req.body);

  const resolved = v3Resolver(req.body);

  if (resolved) {
    const response = { ...req.body, ...resolved };
    log("response", response);
    res.send(JSON.stringify(response));
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
