const Invoice = require("../models/invoiceModel");
const Test = require("../models/testModel");
const User = require("../models/userModel");
const PdfDoc = require("pdfkit");

//create invoice api
exports.createInvoice = async (req, res) => {
  try {
    const { userId, testIds } = req.body;
    const tests = await Test.find({ _id: { $in: testIds } });
    if (tests.length !== testIds.length) {
      return res.status(404).json({ msg: "One or more test not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const testDetails = tests.map((test) => ({
      test: test._id,
      testName: test.name,
      testCategory: test.category,
      price: test.price,
    }));
    const totalPrice = testDetails.reduce((acc, test) => acc + test.price, 0);
    const invoice = new Invoice({
      user: userId,
      tests: testDetails,
      totalPrice: totalPrice,
    });
    await invoice.save();
    return res
      .status(200)
      .json({ msg: "Invoice created successfully", invoice });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create invoice", error: error.message });
  }
};

//get all invoice api
exports.getAllInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("user", "name email");
    return res
      .status(200)
      .json({ msg: "Get all invoice successfully", invoices });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get all invoice", error: error.message });
  }
};

//get invoice by id

exports.getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId).populate(
      "user",
      "name email"
    );
    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }
    res.status(200).json({ msg: "Get invoice by id successfully", invoice });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get invoice by id", error: error.message });
  }
};

//update invoice api
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
    return res
      .status(500)
      .json({ message: "Failed to update invoice", error: error.message });
  }
};

//delete invoice api

exports.deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);
    if (!deletedInvoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }
    res.status(200).json({ msg: "Invoice deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete invoice", error: error.message });
  }
};

//download invoice pdf
exports.downloadPdf = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId).populate(
      "user",
      "name email"
    );
    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }
    const user = invoice.user;
    const testDetails = invoice.tests;
    const totalPrice = invoice.totalPrice;

    const pdf = new PdfDoc();
    let filename = `invoice_${invoiceId}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}`);
    res.setHeader("Content-Type", "application/pdf");

    pdf.pipe(res);

    pdf.fontSize(20).text("Invoice", { align: "center" });
    pdf.moveDown();
    pdf.fontSize(14).text(`User: ${user.name}`, { align: "left" });
    pdf.text(`Email: $${user.email}`);
    pdf.moveDown();

    testDetails.forEach((test, index) => {
      pdf.fontSize(12).text(`Test ${index + 1}: ${test.testName}`);
      pdf.text(`Category: ${test.testCategory}`);
      pdf.text(`Price: $${test.price}`);
      pdf.moveDown();
    });
    pdf.moveDown();
    pdf.fontSize(14).text(`Total Price: $${totalPrice}`, { align: "right" });

    pdf.end();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create invoice", error: error.message });
  }
};
