const winston = require("winston");
const logger = require("./log");

jest.mock("winston", () => ({
  createLogger: jest
    .fn()
    .mockImplementation(() => ({ log: jest.fn().mockReturnValue("LOGGED") })),
  format: { simple: () => "simple" },
  transports: {
    Console: jest.fn().mockImplementation(() => "ConsoleTransport")
  }
}));

describe("db", () => {
  it("should create a logger with winston", () => {
    expect(winston.createLogger).toHaveBeenCalled();
  });

  it("should expose the logger methods", () => {
    expect(logger.log({ message: "Message" })).toEqual("LOGGED");
  });
});
