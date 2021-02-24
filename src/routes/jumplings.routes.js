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

// ROUTES
router.get("/", (req, res) => {
  res.status(200).send(jumplings);
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

module.exports = router;
