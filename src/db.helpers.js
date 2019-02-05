const groupBy = require("lodash.groupby");
const merge = require("lodash.merge");
const set = require("lodash.set");

function entriesToObject(entries) {
  return Object.entries(groupBy(entries, "key")).reduce(
    (accum, [key, entries]) => {
      const entryValues = entries.map(entry => entry.value);

      const objectEntry = {};
      set(objectEntry, key, entryValues);

      return merge(accum, objectEntry);
    },
    {}
  );
}

module.exports = { entriesToObject };
