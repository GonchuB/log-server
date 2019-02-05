const loki = require("lokijs");

const connection = new loki("loki.json");

function db() {
  connection.addCollection("entries");

  return {
    entries: () =>
      connection.getCollection("entries") ||
      connection.addCollection("entries"),
    drop: () => connection.removeCollection("entries")
  };
}

module.exports = db();
