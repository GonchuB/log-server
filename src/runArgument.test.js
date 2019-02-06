jest.mock("minimist", () => i => i[0]);

const VALID_ARGUMENTS = ["argument"];

describe("runArgument", () => {
  let runArgument;
  let currentArgv;

  beforeEach(() => {
    currentArgv = process.argv;

    process.argv = [null, null, { argument: "argumentValue" }];

    runArgument = require("./runArgument");
  });

  afterEach(() => {
    process.argv = currentArgv;
  });

  it("it should return the found argument", () => {
    expect(runArgument(VALID_ARGUMENTS)).toEqual("argumentValue");
  });

  it("it should return an empty string if argument is not valid", () => {
    expect(runArgument([])).toEqual("");
  });

  it("it should return the default value if argument is not valid", () => {
    expect(runArgument([], "default")).toEqual("default");
  });
});
