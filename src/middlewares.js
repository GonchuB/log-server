const bodyParser = require("body-parser");

const json = bodyParser.json();

function cors(_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}

function middlewares(app) {
  app.use(json);
  app.use(cors);
}

module.exports = middlewares;
