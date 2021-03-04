const Jumpling = require("../models/jumpling.model");

const getPresenter = async (next) => {
  try {
    const numberOfJumplings = await Jumpling.estimatedDocumentCount();
    if (!numberOfJumplings) return "No jumplings available...";

    const numberOfUncalledJumplings = await Jumpling.countDocuments({
      called: false,
    });
    if (!numberOfUncalledJumplings) {
      await Jumpling.updateMany({}, { called: false });
    }

    const uncalledJumplings = await Jumpling.find({ called: false });
    const randomNumber = Math.floor(Math.random() * uncalledJumplings.length);
    const unluckyJumpling = uncalledJumplings[randomNumber];
    unluckyJumpling.called = true;
    unluckyJumpling.save();
    return unluckyJumpling;
  } catch (error) {
    next(error);
  }
};

const findOneByName = async (name, next) => {
  try {
    const jumpling = await Jumpling.findOne({ name });
    if (jumpling) return jumpling;
    const error = new Error("Jumpling not found!");
    error.statusCode = 404;
    next(error);
  } catch (error) {
    next(error);
  }
};

const findAll = async (next) => {
  try {
    return await Jumpling.find({});
  } catch (error) {
    next(error);
  }
};

const createOne = async (body, next) => {
  try {
    return await Jumpling.create(body);
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};

const findByIdAndUpdate = async (id, body, next) => {
  try {
    const updatedJumpling = await Jumpling.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (updatedJumpling) return updatedJumpling;
    const error = new Error("Jumpling not found");
    error.statusCode = 404;
    next(error);
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};

const findByIdAndDelete = async (id, next) => {
  try {
    const deletedJumpling = await Jumpling.findByIdAndDelete(id);
    if (!deletedJumpling) {
      const error = new Error("Jumpling not found");
      error.statusCode = 404;
      error.surprise = "HERE I AM";
      next(error);
    } else {
      return deletedJumpling;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPresenter,
  findOneByName,
  findAll,
  createOne,
  findByIdAndUpdate,
  findByIdAndDelete,
};
