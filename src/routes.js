const get = require("lodash.get");
const set = require("lodash.set");
const merge = require("lodash.merge");
const logger = require("./log");
const implementationStrategy = require("./implementationStrategy");

function logEntry(cache, entry) {
  const key = implementationStrategy.key(entry);
  const value = implementationStrategy.value(entry, get(cache, key));

  const objectEntry = {};
  set(objectEntry, key, value);
  merge(cache, objectEntry);

  logger.log({
    level: "info",
    message: `${key} = ${JSON.stringify(value, null, 2)}`
  });
}

function routes(app) {
  let LOG_ENTRIES = {};

  app.post("/log-start", function(req, res) {
    LOG_ENTRIES = {};

    logger.log({
      level: "info",
      message: "Entries cleared"
    });
    res.sendStatus(200);
  });

  app.post("/log-end", function(req, res) {
    const result = implementationStrategy.produce(LOG_ENTRIES);
    const response = JSON.stringify(result, null, 2);

    logger.log({ level: "info", message: response });
    res.send(response);
  });

  app.post("/log", function(req, res) {
    logEntry(LOG_ENTRIES, req.body);

    res.sendStatus(200);
  });
}

module.exports = routes;
