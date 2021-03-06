const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const createJWTToken = require("../utils/jwt");
const User = require("../models/user.model");

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      const err = new Error("Invalid login credentials");
      err.statusCode = 401;
      next(err);
    } else {
      const token = createJWTToken(user.username);

      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeek = oneDay * 7;
      const expiryDate = new Date(Date.now() + oneWeek);

      res.cookie("token", token, {
        expires: expiryDate,
        httpOnly: true,
        secure: true,
      });

      res.status(200).send("You are now logged in!");
    }
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

module.exports = router;
