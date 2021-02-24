const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send({
    0: "GET    /",
    1: "GET    /jumplings",
    2: "POST   /jumplings",
    3: "GET    /jumplings/:name",
    4: "PUT    /jumplings/:id",
    5: "DELETE /jumplings/:id",
    6: "---------------------------",
    7: "GET    /jumplings/presenter",
  });
});

module.exports = app;
