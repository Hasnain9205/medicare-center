const express = require("express");
const upload = require("../middlewares/multer");
const {
  addDoctor,
  allDoctor,
  appointmentsAdmin,
  appointmentCancelAdmin,
  adminDashboard,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/adminController");
const { authenticationRole } = require("../middlewares/authenticationRole");

const adminRouter = express.Router();

adminRouter.post(
  "/add-doctor",
  authenticationRole(["admin"]),
  upload.single("image"),
  addDoctor
);
adminRouter.get("/doctors", authenticationRole(["admin"]), allDoctor);
adminRouter.put(
  "/update-doctor/:id",
  authenticationRole(["admin"]),
  updateDoctor
);
adminRouter.delete(
  "/delete-doctor/:id",
  authenticationRole(["admin"]),
  deleteDoctor
);
adminRouter.get(
  "/all-appointment",
  authenticationRole(["admin"]),
  appointmentsAdmin
);
adminRouter.post(
  "/cancel-appointment",
  authenticationRole(["admin"]),
  appointmentCancelAdmin
);
adminRouter.get("/dashboard", authenticationRole(["admin"]), adminDashboard);

module.exports = adminRouter;
