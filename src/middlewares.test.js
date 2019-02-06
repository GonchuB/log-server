const bodyParser = require("body-parser");
const middlewares = require("./middlewares");

jest.mock("body-parser", () => ({
  json: jest.fn().mockImplementation(() => (_req, _res, next) => next())
}));

function AppMock() {
  const middlewares = [];

  return {
    use: jest
      .fn()
      .mockImplementation(middleware => middlewares.push(middleware)),
    process: jest
      .fn()
      .mockImplementation((req, res, next) =>
        middlewares.forEach(middleware => middleware(req, res, next))
      )
  };
}

describe("middlwares", () => {
  it("should use the json body parser", () => {
    const app = AppMock();

    middlewares(app);

    expect(bodyParser.json).toHaveBeenCalled();
  });

  it("should set the cors headers", () => {
    const app = AppMock();

    middlewares(app);

    const req = {};
    const res = { header: jest.fn() };
    const next = jest.fn();

    app.process(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.header.mock.calls).toEqual([
      ["Access-Control-Allow-Origin", "*"],
      [
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      ],
      ["Content-Type", "application/json"]
    ]);
  });
});
