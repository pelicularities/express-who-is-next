const express = require("express");
const router = express.Router();
const Jumpling = require("../models/jumpling.model");
const protectRoute = require("../middleware/protectRoute");
const jumplingsController = require("../controllers/jumplings.controller");

// ROUTES
router.get("/presenter", async (req, res, next) => {
  const presenter = await jumplingsController.getPresenter(next);
  res.status(200).send(presenter);
});

router.get("/", async (req, res, next) => {
  const jumplings = await jumplingsController.findAll(next);
  res.status(200).send(jumplings);
});

router.get("/:name", async (req, res, next) => {
  const jumpling = await jumplingsController.findOneByName(
    req.params.name,
    next
  );
  res.status(200).send(jumpling);
});

router.post("/", protectRoute, async (req, res, next) => {
  const newJumpling = await jumplingsController.createOne(req.body, next);
  res.status(201).send(newJumpling);
});

router.put("/:id", protectRoute, async (req, res, next) => {
  const updatedJumpling = await jumplingsController.findByIdAndUpdate(
    req.params.id,
    req.body,
    next
  );
  console.log("UPDATE: before controller response");
  res.status(200).send(updatedJumpling);
  console.log("UPDATE: Is this code reachable?");
});

router.delete("/:id", protectRoute, async (req, res, next) => {
  const deletedJumpling = await jumplingsController.findByIdAndDelete(
    req.params.id,
    next
  );
  if (deletedJumpling) {
    console.log("DELETE: before controller response");
    res.status(200).send(deletedJumpling);
    console.log("DELETE: Is this code reachable?");
  }
});

module.exports = router;
