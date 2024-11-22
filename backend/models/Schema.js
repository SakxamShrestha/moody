const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  journal: { type: String, required: true },
  sentiment: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
