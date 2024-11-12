const Test = require("../models/testModel");
const cloudinary = require("cloudinary").v2;

exports.createTest = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;

    const imageFile = req.file;
    let imageUrl = "";

    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    if (imageUpload && imageUpload.secure_url) {
      imageUrl = imageUpload.secure_url;
    } else {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const test = new Test({
      name,
      image: imageUrl,
      category,
      price,
      description,
    });
    await test.save();

    return res.status(200).json({ msg: "Test created successfully", test });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create test", error });
  }
};

//get all test api
exports.getAllTest = async (req, res) => {
  try {
    const tests = await Test.find();
    return res.status(200).json({ msg: "All test get successfully", tests });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create test", error });
  }
};

//get a single test by id api
exports.getTestById = async (req, res) => {
  try {
    const testId = req.params.id;
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ msg: "Test not found" });
    }
    return res.status(200).json({ msg: "Get test by id successfully", test });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create test", error });
  }
};

//update test api

exports.updateTest = async (req, res) => {
  try {
    const { name, image, category, price, description } = req.body;
    const testUpdate = await Test.findByIdAndUpdate(
      req.params.id,
      { name, image, category, price, description },
      { new: true }
    );
    if (!testUpdate) {
      return res.status(404).json({ msg: "Test not found" });
    }
    return res
      .status(200)
      .json({ msg: "Test update successfully", testUpdate });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create test", error });
  }
};

//delete test api
exports.deleteTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const deleteTest = await Test.findByIdAndDelete(testId);
    if (!deleteTest) {
      return res.status(404).json({ msg: "Test not found " });
    }
    res.status(200).json({ msg: "Test delete successfully", deleteTest });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create test", error });
  }
};
