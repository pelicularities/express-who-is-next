const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

// ROUTES
router.post("/", async (req, res, next) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    console.log(user);
    console.log(newUser);
    if (newUser) {
      res.status(201).send(newUser);
    }
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
});

module.exports = router;
