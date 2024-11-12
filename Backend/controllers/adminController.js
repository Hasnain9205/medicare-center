const bcrypt = require("bcrypt");
const validator = require("validator");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");
const cloudinary = require("cloudinary").v2;

exports.addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;
    console.log("Uploaded Image File: ", imageFile);

    if (!imageFile) {
      return res.json({ success: false, message: "Image file is required" });
    }

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    let imageUrl = "";

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      if (imageUpload && imageUpload.secure_url) {
        imageUrl = imageUpload.secure_url;
      } else {
        return res.json({ success: false, message: "Image upload failed" });
      }
    }

    const doctorData = {
      name,
      email,
      password: hashPass,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: address,
      image: imageUrl,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor details added successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

//get all doctor

exports.allDoctor = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    return res
      .status(200)
      .json({ msg: "Get all doctor successfully", doctors });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

//all appointment list

exports.appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    return res
      .status(200)
      .json({ msg: "All appointment get successfully", appointments });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

//appointment cancel admin api

exports.appointmentCancelAdmin = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    return res.status(200).json({ msg: "Appointment cancelled" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//dashboard api for admin
exports.adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    return res.status(200).json({ msg: "All data get successfully", dashData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
