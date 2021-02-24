const { request } = require("express");
const express = require("express");
const app = express();
app.use(express.json());

// MIDDLEWARE
const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    const error = new Error("No application/json, no cigar");
    error.statusCode = 400;
    next(error);
  } else {
    next();
  }
};

app.post("/*", requireJsonContent, (req, res, next) => {
  next();
});
app.put("/*", requireJsonContent, (req, res, next) => {
  next();
});

// ROUTERS
const jumplingsRouter = require("./routes/jumplings.routes");

app.use("/jumplings", jumplingsRouter);

// ROUTES - ./
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

// ERROR HANDLERS
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  res.status(error.statusCode).send(error.message);
});

module.exports = app;
