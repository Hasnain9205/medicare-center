const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  cancelAppointment,
  updateRole,
  getAppointment,
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
  authenticationRole(["user", "admin", "doctor"]),
  updateUserProfile
);
userRouter.post(
  "/book-appointment",
  authenticationRole(["user"]),
  bookAppointment
);
userRouter.get(
  "/appointments",
  authenticationRole(["user", "admin"]),
  getAppointment
);
userRouter.delete(
  "/appointments/:id",
  authenticationRole(["user"]),
  cancelAppointment
);
userRouter.put("/user-role/:userId", authenticationRole(["admin"]), updateRole);

module.exports = userRouter;
