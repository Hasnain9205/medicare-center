const express = require("express");
const { authenticationRole } = require("../middlewares/authenticationRole");
const {
  createTest,
  getAllTest,
  updateTest,
  deleteTest,
  getTestById,
  bookTest,
  getBookedTests,
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
  "/test-by-id/:id",
  authenticationRole(["user", "admin"]),
  getTestById
);
testRouter.put("/update-test/:id", authenticationRole(["admin"]), updateTest);
testRouter.delete(
  "/delete-test/:id",
  authenticationRole(["admin"]),
  deleteTest
);
testRouter.delete("/booked-test", authenticationRole(["user"]), bookTest);
testRouter.delete(
  "/get-booked-test",
  authenticationRole(["user"]),
  getBookedTests
);

module.exports = testRouter;
