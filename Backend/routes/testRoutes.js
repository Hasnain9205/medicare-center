const express = require("express");
const { authenticationRole } = require("../middlewares/authenticationRole");
const {
  createTest,
  getAllTest,
  updateTest,
  getTestById,
  bookTest,
  cancelTest,
  getTestAppointment,
  payment,
  paymentSuccess,
  paymentHistory,
  updateTestAppointmentStatus,
} = require("../controllers/testController");
const upload = require("../middlewares/multer");

const testRouter = express.Router();

testRouter.post(
  "/create-test",
  authenticationRole(["admin"]),
  upload.single("image"),
  createTest
);
testRouter.get("/get-all-test", getAllTest);
testRouter.get(
  "/test-by-id/:testId",
  authenticationRole(["user", "admin"]),
  getTestById
);
testRouter.post("/book-test", authenticationRole(["user"]), bookTest);
testRouter.get(
  "/get-test-appointment",
  authenticationRole(["user", "admin"]),
  getTestAppointment
);
testRouter.patch(
  "/update-appointment-status/:id",
  authenticationRole(["admin"]),
  updateTestAppointmentStatus
);
testRouter.put("/update-test/:id", authenticationRole(["admin"]), updateTest);
testRouter.post("/cancel/:id", authenticationRole(["user"]), cancelTest);
testRouter.post("/create-payment-intent", payment);
testRouter.post("/payment-success", paymentSuccess);
testRouter.post("/history", authenticationRole(["admin"]), paymentHistory);

module.exports = testRouter;
