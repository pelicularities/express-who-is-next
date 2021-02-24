const express = require("express");
const router = express.Router();
const Joi = require("joi");

// SCHEMA AND VALIDATION
const validateJumpling = (jumpling) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
  });
  return schema.validate(jumpling);
};

// DATA
const jumplings = [];
let nextId = 1;

// PARAM CALLBACKS
router.param("id", (req, res, next, id) => {
  const jumpling = jumplings.find((jumpling) => jumpling.id === parseInt(id));
  if (!jumpling) {
    const error = new Error("Jumpling not found!");
    error.statusCode = 404;
    next(error);
  } else {
    req.jumpling = jumpling;
    req.jumplingIndex = jumplings.indexOf(jumpling);
    next();
  }
});

// ROUTES
router.get("/", (req, res) => {
  res.status(200).send(jumplings);
});

router.get("/:id", (req, res) => {
  res.status(200).send(req.jumpling);
});

router.post("/", (req, res, next) => {
  const newJumpling = {
    id: nextId,
    ...req.body,
  };
  const validation = validateJumpling(newJumpling);
  if (validation.error) {
    const error = new Error(validation.error.details[0].message);
    error.statusCode = 422;
    next(error);
  } else {
    nextId++;
    jumplings.push(newJumpling);
    res.status(201).json(newJumpling);
  }
});

router.put("/:id", (req, res, next) => {
  const updatedJumpling = {
    id: req.jumpling.id,
    ...req.body,
  };
  const validation = validateJumpling(updatedJumpling);
  if (validation.error) {
    const error = new Error(validation.error.details[0].message);
    error.statusCode = 422;
    next(error);
  } else {
    jumplings[req.jumplingIndex] = updatedJumpling;
    res.status(200).json(jumplings[req.jumplingIndex]);
  }
});

router.delete("/:id", (req, res, next) => {
  const deletedJumpling = jumplings[req.jumplingIndex];
  jumplings.splice(req.jumplingIndex, 1);
  res.status(200).json(deletedJumpling);
});

module.exports = router;
