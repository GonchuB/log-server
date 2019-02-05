const loki = require("lokijs");
const runArgument = require("./runArgument");

const connection = new loki("loki.json");

const COLLECTION_OPTIONS = ["c", "collection"];

function db() {
  const collectionName = runArgument(COLLECTION_OPTIONS, "entries");

  connection.addCollection(collectionName);

  return {
    entries: () =>
      connection.getCollection(collectionName) ||
      connection.addCollection(collectionName),
    drop: () => connection.removeCollection(collectionName)
  };
}

module.exports = db();
