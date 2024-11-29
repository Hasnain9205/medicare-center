const Invoice = require("../models/invoiceModel");
const Test = require("../models/testModel");
const userModel = require("../models/userModel");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Create invoice API
exports.createInvoice = async (req, res) => {
  try {
    const { userId, testIds, dueDate } = req.body;

    // Fetch user and tests based on IDs
    const user = await userModel.findById(userId);
    const tests = await Test.find({ _id: { $in: testIds } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!tests.length) {
      return res.status(400).json({ message: "No valid tests selected" });
    }

    // Calculate total price
    const totalPrice = tests.reduce((sum, test) => sum + test.price, 0);

    // Create invoice
    const invoice = new Invoice({
      user: userId,
      tests: tests.map((test) => ({
        testName: test.name,
        testCategory: test.category,
        price: test.price,
      })),
      totalPrice,
      paymentStatus: "unpaid", // Default status
      dueDate, // Due date for the invoice
    });

    await invoice.save();

    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating invoice", error: error.message });
  }
};

// Get all invoices API
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("user", "name email");
    return res
      .status(200)
      .json({ msg: "Get all invoices successfully", invoices });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get all invoices", error: error.message });
  }
};

// Get invoice by userId API
exports.getInvoiceByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const invoices = await Invoice.find({ user: userId }).populate(
      "user",
      "name email"
    );
    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ msg: "No invoices found for this user" });
    }
    res.status(200).json({ msg: "Invoices fetched successfully", invoices });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get invoices by userId",
      error: error.message,
    });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      req.body,
      { new: true }
    );
    if (!updatedInvoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }
    res
      .status(200)
      .json({ msg: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update invoice", error: error.message });
  }
};

// Delete invoice API
exports.deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);
    if (!deletedInvoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }
    res.status(200).json({ msg: "Invoice deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete invoice", error: error.message });
  }
};

// Function to generate and download invoice PDF
exports.downloadPdf = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    // Find the invoice by ID
    const invoice = await Invoice.findById(invoiceId).populate(
      "user",
      "name email"
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response header for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${invoice._id}.pdf`
    );

    // Pipe the document to the response
    doc.pipe(res);

    // Add title and other details to the PDF
    doc.fontSize(18).text("Invoice", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(12).text(`Invoice ID: ${invoice._id}`);
    doc.text(`User: ${invoice.user.name}`);
    doc.text(`Email: ${invoice.user.email}`);
    doc.text(`Total Price: $${invoice.totalPrice}`);
    doc.text(`Payment Status: ${invoice.paymentStatus}`);
    doc.text(`Due Date: ${invoice.dueDate}`);

    doc.moveDown(2);
    doc.text("Tests:", { underline: true });
    invoice.tests.forEach((test) => {
      doc.text(`- ${test.testName} (${test.testCategory}): $${test.price}`);
    });

    // End the document and send it to the client
    doc.end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating PDF", error: error.message });
  }
};
