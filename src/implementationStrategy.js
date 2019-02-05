const path = require("path");
const identity = require("lodash.identity");
const runArgument = require("./runArgument");

const FILENAME_OPTIONS = ["f", "filename", "file", "o", "output"];

function implementationStrategy() {
  const entriesFilename = runArgument(FILENAME_OPTIONS);

  if (entriesFilename) {
    const filepath = path.isAbsolute(entriesFilename)
      ? entriesFilename
      : path.join(__dirname, "..", entriesFilename);

    // { key, value, produce }
    return require(filepath);
  } else {
    const random = () => ["A", "B", "C"][Math.floor(Math.random() * 3)];
    const getEntry = () => `${random()}.${random()}.${random()}`;

    return { key: getEntry, value: () => "A", produce: identity };
  }
}

module.exports = implementationStrategy();
