const express = require("express");
const request = require("supertest");
const routes = require("./routes");
const middlewares = require("./middlewares");

jest.mock("./implementationStrategy", () => ({
  key: () => "key",
  value: () => "value",
  produce: () => "produce"
}));

const initRoutes = () => {
  const app = express();
  middlewares(app);
  routes(app);

  return app;
};

describe("POST log-start", () => {
  test("return a 200", async () => {
    const app = initRoutes();
    const response = await request(app)
      .post("/log-start")
      .set("Content-Type", "application/json")
      .send();
    expect(response.statusCode).toBe(200);
  });
});

describe("POST log", () => {
  test("return a 200", async () => {
    const app = initRoutes();
    const response = await request(app)
      .post("/log")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send({ some: "payload" });

    expect(response.statusCode).toBe(200);
  });
});

describe("POST log-end", () => {
  test("return the correct payload", async () => {
    const app = initRoutes();
    const response = await request(app)
      .post("/log-end")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send();

    expect(response.body).toBe("produce");
  });
});
