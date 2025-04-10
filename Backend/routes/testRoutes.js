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
  downloadInvoice,
  getInvoice,
  deleteTest,
  completedTestAppointment,
} = require("../controllers/testController");
const upload = require("../middlewares/multer");

const testRouter = express.Router();

testRouter.post(
  "/create-test",
  authenticationRole(["diagnostic"]),
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

testRouter.post(
  "/completed-test/:appointmentId",
  authenticationRole(["diagnostic"]),
  completedTestAppointment
);
testRouter.patch(
  "/update-appointment-status/:id",
  authenticationRole(["admin"]),
  updateTestAppointmentStatus
);
testRouter.put(
  "/update-test/:id",
  authenticationRole(["admin", "diagnostic"]),
  updateTest
);
testRouter.delete(
  "/delete-test/:id",
  authenticationRole(["admin", "diagnostic"]),
  deleteTest
);
testRouter.post(
  "/cancel/:id",
  authenticationRole(["user", "diagnostic"]),
  cancelTest
);
testRouter.post(
  "/create-payment-intent",
  authenticationRole(["user"]),
  payment
);

testRouter.post("/history", authenticationRole(["admin"]), paymentHistory);

testRouter.post(
  "/payment-success",
  authenticationRole(["user"]),
  paymentSuccess
);

testRouter.get(
  "/download-invoice/:appointmentId",
  authenticationRole(["user"]),
  downloadInvoice
);
testRouter.get("/invoices", authenticationRole(["user", "admin"]), getInvoice);

module.exports = testRouter;
