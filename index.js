const express = require("express");
const middlewares = require("./src/middlewares");
const routes = require("./src/routes");
const logger = require("./src/log");

const port = process.env.PORT || 3000;
const app = express();

middlewares(app);
routes(app);

app.listen(port, () =>
  logger.log({
    level: "info",
    message: `Example app listening on port ${port}!`,
    service: "log-server"
  })
);
