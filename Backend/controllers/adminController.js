const bcrypt = require("bcrypt");
const validator = require("validator");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");
const cloudinary = require("cloudinary").v2;

// Add doctor API
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
      image,
      availableSlots, // Array of available slots (slotDate and slotTime)
    } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image URL is required" });
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
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const doctorData = {
      name,
      email,
      password: hashPass,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      image,
      date: Date.now(),
      slots_booked: [], // Initialize with an empty array
    };

    // Save doctor data
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    // Now add available slots for the doctor if provided
    if (availableSlots && availableSlots.length > 0) {
      // Add slots to the doctor document
      const slots = availableSlots.map((slot) => ({
        slotDate: slot.slotDate,
        slotTime: slot.slotTime,
        booked: false, // Initially, all slots are unbooked
      }));

      // Update the doctor's slots_booked field
      newDoctor.slots_booked = [...newDoctor.slots_booked, ...slots];
      await newDoctor.save();
    }

    res.status(201).json({
      success: true,
      message: "Doctor details added successfully along with slots",
      newDoctor,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred, please try again" });
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

//update doctor api
exports.updateDoctor = async (req, res) => {
  try {
    const {
      doctorId,
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

    const imageFile = req.file; // Assume multer is being used for handling file uploads

    // Validate required fields
    if (
      !doctorId ||
      !name ||
      !email ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Prepare updated data
    const updateData = {
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    };

    // Hash password if updated
    if (password) {
      if (password.length < 8) {
        return res.json({
          success: false,
          message: "Password must be at least 8 characters",
        });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Image upload handling
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });

      if (imageUpload && imageUpload.secure_url) {
        updateData.image = imageUpload.secure_url;
      } else {
        return res.json({ success: false, message: "Image upload failed" });
      }
    }

    // Update doctor in database
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true }
    );

    if (!updatedDoctor) {
      return res.json({
        success: false,
        message: "Doctor not found or update failed",
      });
    }

    return res.json({
      success: true,
      message: "Doctor details updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//delete doctor api
// Delete doctor API
exports.deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Check if doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Delete the doctor
    await doctorModel.findByIdAndDelete(doctorId);

    // Optionally, delete doctor's associated appointments (if needed)
    await appointmentModel.deleteMany({ docId: doctorId });

    // Return response
    return res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
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
