const identity = require("lodash.identity");
const logger = require("./log");
const db = require("./db");
const { entriesToObject } = require("./db.helpers.js");
const implementationStrategy = require("./implementationStrategy");

function logEntry(entries, entry) {
  const key = implementationStrategy.key(entry);
  const value = implementationStrategy.value(entry);

  entries.insert({ key, value });

  logger.log({
    level: "info",
    message: `${key} = ${JSON.stringify(value, null, 2)}`
  });
}

function routes(app) {
  app.post("/log-start", function(req, res) {
    logger.log({
      level: "info",
      message: "Entries cleared"
    });
    res.sendStatus(200);
  });

  app.post("/log-end", function(req, res) {
    const result = implementationStrategy.produce(
      db.entries().mapReduce(identity, entriesToObject)
    );

    const response = JSON.stringify(result, null, 2);

    logger.log({ level: "info", message: response });
    res.send(response);
  });

  app.post("/log", function(req, res) {
    logEntry(db.entries(), req.body);

    res.sendStatus(200);
  });
}

module.exports = routes;
