const express = require("express");
const router = express.Router();
const Jumpling = require("../models/jumpling.model");
const protectRoute = require("../middleware/protectRoute");
const jumplingsController = require("../controllers/jumplings.controller");

// PARAM CALLBACKS
// router.param("name", async (req, res, next, name) => {
//   const jumpling = await Jumpling.findOne({ name });
//   if (!jumpling) {
//     const error = new Error("Jumpling not found!");
//     error.statusCode = 404;
//     next(error);
//   } else {
//     req.jumpling = jumpling;
//     next();
//   }
// });

// router.param("id", async (req, res, next, id) => {
//   const jumpling = await Jumpling.findById(id);
//   if (!jumpling) {
//     const error = new Error("Jumpling not found!");
//     error.statusCode = 404;
//     next(error);
//   } else {
//     req.jumpling = jumpling;
//     req.jumplingId = id;
//     next();
//   }
// });

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
  res.status(200).send(updatedJumpling);
});

router.delete("/:id", protectRoute, async (req, res, next) => {
  const deletedJumpling = await jumplingsController.findByIdAndDelete(
    req.params.id,
    next
  );
  if (deletedJumpling) res.status(200).send(deletedJumpling);
});

module.exports = router;
