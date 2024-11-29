const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    role: { type: String, default: "doctor" },
    date: { type: Date, default: Date.now },

    maxSlots: { type: Number, default: 20 },
    slots_booked: [
      {
        slotDate: { type: Date },
        slotTime: { type: String },
        booked: { type: Boolean, default: false },
      },
    ],
  },
  { minimize: false }
);

module.exports =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
