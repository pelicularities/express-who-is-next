const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jumplingSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
    match: /[A-Za-z]{3,}/,
  },
});

const Jumpling = mongoose.model("Jumpling", jumplingSchema);
module.exports = Jumpling;
