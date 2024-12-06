const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
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
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid", // More descriptive payment status
    },
    issuedAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true }, // Add a due date for payment
  },
  { timestamps: true } // Automatic timestamps for createdAt and updatedAt
);

module.exports = mongoose.model("Invoice", invoiceSchema);
