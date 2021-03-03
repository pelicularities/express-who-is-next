const express = require("express");
const router = express.Router();
const Jumpling = require("../models/jumpling.model");
const protectRoute = require("../middleware/protectRoute");

// PARAM CALLBACKS
router.param("name", async (req, res, next, name) => {
  const jumpling = await Jumpling.findOne({ name });
  if (!jumpling) {
    const error = new Error("Jumpling not found!");
    error.statusCode = 404;
    next(error);
  } else {
    req.jumpling = jumpling;
    next();
  }
});

router.param("id", async (req, res, next, id) => {
  const jumpling = await Jumpling.findById(id);
  if (!jumpling) {
    const error = new Error("Jumpling not found!");
    error.statusCode = 404;
    next(error);
  } else {
    req.jumpling = jumpling;
    req.jumplingId = id;
    next();
  }
});

// ROUTES
router.get("/presenter", async (req, res) => {
  const jumplings = await Jumpling.find({});
  const numberOfJumplings = jumplings.length;
  if (!numberOfJumplings) {
    res.status(200).send("No jumplings available...");
  } else {
    const randomNumber = Math.floor(Math.random() * numberOfJumplings);
    res.status(200).send(jumplings[randomNumber]);
  }
});

router.get("/", async (req, res) => {
  const jumplings = await Jumpling.find({});
  res.status(200).send(jumplings);
});

router.get("/:name", (req, res) => {
  res.status(200).send(req.jumpling);
});

router.post("/", protectRoute, async (req, res, next) => {
  try {
    const newJumpling = await Jumpling.create(req.body);
    if (newJumpling) {
      res.status(201).json(newJumpling);
    }
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
});

router.put("/:id", protectRoute, async (req, res, next) => {
  try {
    const updatedJumpling = await Jumpling.findByIdAndUpdate(
      req.jumplingId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedJumpling) {
      res.status(200).json(updatedJumpling);
    }
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    await Jumpling.findByIdAndDelete(req.jumplingId);
    res.status(200).json(req.jumpling);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
