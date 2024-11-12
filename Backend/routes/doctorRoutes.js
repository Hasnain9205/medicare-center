const express = require("express");
const {
  doctorList,
  doctorAppointment,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  doctorDetails,
} = require("../controllers/doctorController");
const { authenticationRole } = require("../middlewares/authenticationRole");

const doctorRouter = express.Router();

doctorRouter.get("/doctor-details/:id", doctorDetails);
doctorRouter.get("/doctors-list", doctorList);
doctorRouter.get(
  "/appointment-doctor",
  authenticationRole(["doctor"]),
  doctorAppointment
);
doctorRouter.post(
  "/complete-appointment",
  authenticationRole(["doctor"]),
  appointmentComplete
);
doctorRouter.post(
  "/cancel-appointment",
  authenticationRole(["doctor", "admin"]),
  appointmentCancel
);
doctorRouter.get(
  "/dashboard",
  authenticationRole(["doctor", "admin"]),
  doctorDashboard
);
doctorRouter.get("/profile", authenticationRole(["doctor"]), doctorProfile);
doctorRouter.post(
  "/update-profile",
  authenticationRole(["doctor"]),
  updateDoctorProfile
);

module.exports = doctorRouter;
