const mongoose = require("mongoose");

const appointmentModel = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  docId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  centerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "center",
    required: true,
  },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: String, required: true },
  docData: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
});
module.exports =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentModel);
