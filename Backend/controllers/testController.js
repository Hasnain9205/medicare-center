const Test = require("../models/testModel");
const cloudinary = require("cloudinary").v2;

// Create Test
exports.createTest = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    if (!name || !category || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });

    const newTest = await Test.create({
      name,
      image: uploadResult.secure_url,
      category,
      price,
      description,
    });

    res
      .status(201)
      .json({ message: "Test created successfully", test: newTest });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating test", error: error.message });
  }
};

// Get All Tests
exports.getAllTest = async (req, res) => {
  try {
    const tests = await Test.find({ deleted: { $ne: true } });
    res.status(200).json({ message: "Tests fetched successfully", tests });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tests", error: error.message });
  }
};

// Get Test by ID
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });
    res.status(200).json({ message: "Test fetched successfully", test });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching test", error: error.message });
  }
};

// Update Test
exports.updateTest = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    const updates = { name, category, price, description };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      updates.image = uploadResult.secure_url;
    }

    const updatedTest = await Test.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updatedTest)
      return res.status(404).json({ message: "Test not found" });
    res
      .status(200)
      .json({ message: "Test updated successfully", test: updatedTest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating test", error: error.message });
  }
};

// Delete Test (Soft Delete)
exports.deleteTest = async (req, res) => {
  try {
    const deletedTest = await Test.findByIdAndDelete(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!deletedTest)
      return res.status(404).json({ message: "Test not found" });
    res
      .status(200)
      .json({ message: "Test deleted successfully", test: deletedTest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting test", error: error.message });
  }
};

exports.bookTest = async (req, res) => {
  try {
    const { testId, userId, userData } = req.body;

    // Validate inputs
    if (!testId || !userId || !userData) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the test to book
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (test.status === "booked") {
      return res.status(400).json({ message: "Test already booked" });
    }

    // Update the test as booked
    test.status = "booked";
    test.userId = userId;
    test.userData = userData;

    await test.save();

    res.status(200).json({
      message: "Test booked successfully",
      test,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error booking test", error: error.message });
  }
};

exports.getBookedTests = async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch booked tests
    const filter = { status: "booked" };
    if (userId) {
      filter.userId = userId; // Filter by userId if provided
    }

    const bookedTests = await Test.find(filter);

    res.status(200).json({
      message: "Booked tests fetched successfully",
      bookedTests,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching booked tests", error: error.message });
  }
};
