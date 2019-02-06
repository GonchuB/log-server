describe("implementationStrategy", () => {
  let implementationStrategy;

  describe("without entries filename", () => {
    beforeEach(() => {
      jest.mock("./runArgument", () => () => "");
      implementationStrategy = require("./implementationStrategy");
    });

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

  describe("with entries filename", () => {
    beforeEach(() => {
      jest.mock("./runArgument", () => () => "./index");
      jest.mock("../index", () => ({
        key: () => "keyImpl",
        value: () => "valueImpl",
        produce: () => "produceImpl"
      }));
      implementationStrategy = require("./implementationStrategy");
    });

    it("should return the key function implementation", () => {
      expect(implementationStrategy.key).toBeDefined;
      expect(implementationStrategy.key()).toEqual("keyImpl");
    });

    it("should return the value function implementation", () => {
      expect(implementationStrategy.value).toBeDefined;
      expect(implementationStrategy.value()).toEqual("valueImpl");
    });

    it("should return the produce function implementation", () => {
      expect(implementationStrategy.produce).toBeDefined;
      expect(implementationStrategy.produce()).toEqual("produceImpl");
    });
  });
});
