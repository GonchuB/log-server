const identity = require("lodash.identity");
const logger = require("./log");
const db = require("./db");
const { entriesToObject } = require("./db.helpers.js");
const implementationStrategy = require("./implementationStrategy");

function logEntry(entries, body) {
  const key = implementationStrategy.key(body);
  const value = implementationStrategy.value(body);

  const entry = { key, value };
  entries.insert(entry);

  return entry;
}

function routes(app) {
  app.post("/log-start", function(req, res) {
    db.drop();

    logger.log({
      level: "info",
      message: "Entries cleared",
      service: "routes/POST/log-start"
    });
    res.sendStatus(200);
  });

  app.post("/log-end", function(req, res) {
    const result = implementationStrategy.produce(
      db.entries().mapReduce(identity, entriesToObject)
    );

    const response = JSON.stringify(result, null, 2);

    logger.log({
      level: "info",
      message: response,
      service: "routes/POST/log-end"
    });
    res.send(response);
  });

  app.post("/log", function(req, res) {
    const { key, value } = logEntry(db.entries(), req.body);

    logger.log({
      level: "info",
      message: `${key} = ${JSON.stringify(value, null, 2)}`,
      service: "routes/POST/log"
    });

    res.sendStatus(200);
  });
}

module.exports = routes;
