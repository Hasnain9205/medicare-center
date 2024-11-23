const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["available", "booked", "completed", "cancelled"],
    default: "available",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Booked by
  userData: {
    type: {
      name: String,
      email: String,
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Test", TestSchema);
