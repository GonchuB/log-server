const minimist = require("minimist");

function withArguments(runArguments) {
  return function runArgument(validArguments, defaultValue = "") {
    return (Object.entries(runArguments).find(entry => {
      const key = entry[0];

      return Boolean(runArguments[key]) && validArguments.includes(key);
    }) || ["", defaultValue])[1];
  };
}

module.exports = withArguments(minimist(process.argv.slice(2)));
