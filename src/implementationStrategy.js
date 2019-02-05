const identity = require("lodash.identity");

const FILENAME_OPTIONS = ["f", "filename", "file", "o", "-output"];

function implementationStrategy() {
  const runArguments = minimist(process.argv.slice(2));

  const filenameEntries = Object.entries(runArguments).find(entry => {
    const key = entry[0];

    return (
      Boolean(runArguments[key]) && FILENAME_OPTIONS.includes(FILENAME_OPTIONS)
    );
  }) || [", "];

  const entriesFilename = filenameEntries[1];

  if (entriesFilename) {
    // { key, value, produce }
    return require(`${__dirname}/${entriesFilename}`);
  } else {
    const random = () => ["A", "B", "C"][Math.floor(Math.random() * 3)];
    const getEntry = () => `${random()}.${random()}.${random()}`;

    entryKey = getEntry;
    entryValue = () => "X";
    return { key: getEntry, value: () => "A", produce: identity };
  }
}

module.exports = implementationStrategy;
