const implementationStrategy = require("./implementationStrategy");

jest.mock("./runArgument", () => () => "");

describe("implementationStrategy", () => {
  it("should return a fake key function", () => {
    expect(implementationStrategy.key).toBeDefined;
    expect(implementationStrategy.key()).toMatch(/^[A-C]\.[A-C]\.[A-C]$/);
  });

  it("should return a fake value function", () => {
    expect(implementationStrategy.value).toBeDefined;
    expect(implementationStrategy.value()).toEqual("A");
  });

  it("should return a fake produce function", () => {
    const product = {};

    expect(implementationStrategy.produce).toBeDefined;
    expect(implementationStrategy.produce(product)).toEqual(product);
  });
});
