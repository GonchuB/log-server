const minimist = require("minimist");
const get = require("lodash.get");
const set = require("lodash.set");
const merge = require("lodash.merge");
const logger = require("./log");
const implementationStrategy = require("./implementationStrategy");

function logEntry(cache, entry) {
  const key = implementationStrategy.entryKey(entry);
  const value = implementationStrategy.entryValue(entry, get(cache, key));

  const objectEntry = {};
  set(objectEntry, key, value);
  merge(cache, objectEntry);

  logger.log({
    level: "dev",
    message: `${key} = ${JSON.stringify(value, null, 2)}`
  });
}

function routes(app) {
  let LOG_ENTRIES = {};

  app.post("/log-start", function(req, res) {
    LOG_ENTRIES = {};

    logger.log({
      level: "dev",
      message: "Entries cleared"
    });
    res.sendStatus(200);
  });

  app.post("/log-end", function(req, res) {
    const result = implementationStrategy.produceResult(LOG_ENTRIES);
    const response = JSON.stringify(result, null, 2);

    logger.log({ level: "dev", message: response });
    res.send(response);
  });

  app.post("/log", function(req, res) {
    logEntry(LOG_ENTRIES, req.body);

    res.sendStatus(200);
  });
}

module.exports = routes;
