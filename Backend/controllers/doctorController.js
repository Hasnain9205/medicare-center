const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");

// get doctorDetails api
exports.doctorDetails = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    const slotsAvailable = Object.values(doctor.slots_booked || {}).some(
      (slots) => slots.length < doctor.total_slots
    );

    doctor.available = slotsAvailable;
    await doctor.save();

    return res
      .status(200)
      .json({ msg: "Doctor details retrieved successfully", doctor });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
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
    const { docId } = req.body;
    const appointment = await appointmentModel.find({ docId });
    return res
      .status(200)
      .json({ msg: "All appointment get successfully", appointment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//completed appointment

exports.appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.status(200).json({ msg: "appointment completed" });
    } else {
      return res.status(400).json({ msg: "Appointment completed failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//cancelled appointment for doctor api

exports.appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.status(200).json({ msg: "appointment cancelled" });
    } else {
      return res.status(400).json({ msg: "Appointment cancelled failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//doctor dashboard

exports.doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });
    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    return res
      .status(200)
      .json({ msg: "Doctor dashboard data get successfully", dashData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
