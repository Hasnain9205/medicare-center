const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tests: [
    {
      test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true,
      },
      testName: { type: String, required: true },
      testCategory: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, default: "unpaid" },
  issuedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
