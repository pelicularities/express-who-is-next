const express = require("express");
const router = express.Router();

// DATA
const jumplings = [];

// ROUTES
router.get("/", (req, res) => {
  res.status(200).send(jumplings);
});

module.exports = router;
