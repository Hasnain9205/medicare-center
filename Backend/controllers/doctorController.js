const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");

// get doctorDetails api
exports.doctorDetails = async (req, res) => {
  try {
    const docId = req.params.id;
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    const slotsAvailable = doctor.slots_booked.some((slot) => !slot.booked);
    doctor.available = slotsAvailable;
    await doctor.save();

    return res.status(200).json({
      msg: "Doctor details retrieved successfully",
      doctor: {
        ...doctor.toObject(),
        available: doctor.available,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    return res
      .status(200)
      .json({ msg: "Doctor list get successfully", doctors });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get doctor appointments

exports.doctorAppointment = async (req, res) => {
  try {
    // Get docId from query parameters
    const { docId } = req.query;

    // Validate that docId is provided
    if (!docId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    // Fetch appointments for the given doctor, sorted by slotDate in descending order
    const appointments = await appointmentModel
      .find({ docId })
      .sort({ slotDate: -1 }) // Sort by slotDate descending
      .populate("userData", "name"); // Optionally populate user data if needed (e.g., patient's name)
    console.log("a...", appointments);
    // Check if appointments are found
    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No appointments found for this doctor" });
    }

    // Return the fetched appointments
    return res.status(200).json({
      msg: "Appointments fetched successfully",
      appointment: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ message: error.message });
  }
};

//completed appointment

exports.appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    console.log("appoitnemnt...", appointmentData);
    if (appointmentData.status === "completed") {
      return res
        .status(400)
        .json({ msg: "This appointment is already completed" });
    }

    if (!appointmentData) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    if (appointmentData.docId.toString() !== docId) {
      return res
        .status(400)
        .json({ msg: "Appointment does not belong to this doctor" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
      status: "completed",
    });
    return res.status(200).json({ msg: "Appointment completed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//cancelled appointment for doctor api

exports.appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.status === "cancelled") {
      return res
        .status(400)
        .json({ msg: "This appointment is already cancelled" });
    }
    if (appointmentData.docId.toString() !== docId) {
      return res
        .status(400)
        .json({ msg: "Appointment does not belong to this doctor" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      status: "cancelled",
    });
    return res.status(200).json({ msg: "appointment cancelled" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//doctor dashboard
exports.doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.query;
    if (!docId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }
    const appointments = await appointmentModel
      .find({ docId })
      .sort({ slotDate: -1 });
    let earnings = 0;
    const patients = new Set();
    appointments.forEach((appointment) => {
      if (appointment.isCompleted || appointment.payment) {
        earnings += appointment.amount || 0;
      }
      patients.add(appointment.userId.toString());
    });

    // Prepare dashboard data
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.size, // Count of unique patients
      latestAppointments: appointments.slice(0, 5), // Latest 5 appointments
    };

    // Send success response with data
    return res
      .status(200)
      .json({ msg: "Doctor dashboard data retrieved successfully", dashData });
  } catch (error) {
    console.error("Error fetching doctor dashboard data:", error); // Log for debugging
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

//get doctor profile api

exports.doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    return res
      .status(200)
      .json({ msg: "Doctor profile get successfully", profileData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//update doctor profile api

exports.updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });
    return res.status(200).json({ msg: "Doctor profile updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
