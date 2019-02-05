const logger = require("../log");
const get = require("lodash.get");
const set = require("lodash.set");
const merge = require("lodash.merge");

let entryKey;
let entryValue;
let produceResult;

if (process.env.NODE_ENV !== "DEV") {
  let entries = require("../../impls");

  entryKey = entries.key;
  entryValue = entries.value;
  produceResult = entries.produce;
} else {
  const random = () => ["A", "B", "C"][Math.floor(Math.random() * 3)];
  const getEntry = () => `${random()}.${random()}.${random()}`;

  entryKey = getEntry;
  entryValue = () => "X";
  produceResult = i => i;
}

function logEntry(cache, entry) {
  const key = entryKey(entry);
  const value = entryValue(entry, get(cache, key));

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
    const result = produceResult(LOG_ENTRIES);
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
