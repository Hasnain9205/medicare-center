const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Test", TestSchema);
