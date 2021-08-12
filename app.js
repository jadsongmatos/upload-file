const express = require("express");
const logger = require("morgan");
const app = express();

app.use(logger("dev"));

const routes = require("./routes");
app.use("/", routes);

module.exports = app;
