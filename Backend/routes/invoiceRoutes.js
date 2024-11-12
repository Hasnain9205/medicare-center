const express = require("express");
const { authenticationRole } = require("../middlewares/authenticationRole");
const {
  createInvoice,
  downloadPdf,
  getAllInvoice,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");

const invoiceRouter = express.Router();

invoiceRouter.post(
  "/create-invoice",
  authenticationRole(["user", "admin"]),
  createInvoice
);
invoiceRouter.get("/all-invoice", authenticationRole(["admin"]), getAllInvoice);
invoiceRouter.get(
  "/get-invoice/:invoiceId",
  authenticationRole(["admin", "user"]),
  getInvoiceById
);
invoiceRouter.put(
  "/update-invoice/:invoiceId",
  authenticationRole(["admin"]),
  updateInvoice
);
invoiceRouter.delete(
  "/delete-invoice/:invoiceId",
  authenticationRole(["admin"]),
  deleteInvoice
);
invoiceRouter.get(
  "/download-pdf/:invoiceId",
  authenticationRole(["user", "admin"]),
  downloadPdf
);

module.exports = invoiceRouter;
