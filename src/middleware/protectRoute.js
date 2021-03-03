require("dotenv").config();
const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      const err = new Error("You are not authorised. You shall not pass!");
      err.statusCode = 401;
      next(err);
    } else {
      req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
      next();
    }
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

module.exports = protectRoute;
