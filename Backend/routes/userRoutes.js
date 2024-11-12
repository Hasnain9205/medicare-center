const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentAppointment,
  confirmPayment,
  updateRole,
} = require("../controllers/userController");
const { authenticationRole } = require("../middlewares/authenticationRole");
const upload = require("../middlewares/multer");

const userRouter = express.Router();

userRouter.post("/register", upload.single("profileImage"), registerUser);
userRouter.post("/login", loginUser);
userRouter.get(
  "/profile",
  authenticationRole(["user", "admin", "doctor"]),
  getUserProfile
);
userRouter.put(
  "/update-profile",
  authenticationRole(["user", "admin"]),
  upload.single("image"),
  updateUserProfile
);
userRouter.post("/book-appointment", bookAppointment);
userRouter.get(
  "/appointments",
  authenticationRole(["user", "admin"]),
  listAppointment
);
userRouter.post("/cancelled", cancelAppointment);
userRouter.post("/payment", paymentAppointment);
userRouter.post("/confirm-payment/:appointmentId", confirmPayment);
userRouter.put("/user-role/:userId", authenticationRole(["admin"]), updateRole);

module.exports = userRouter;
