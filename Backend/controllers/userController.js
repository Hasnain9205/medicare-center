const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const cloudinary = require("cloudinary").v2;
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ msg: "Password must be at 8 characters" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const saltPass = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, saltPass);

    if (req.file) {
      const fileType = req.file.mimetype.split("/")[0];
      if (fileType !== "image") {
        return res.status(400).json({ msg: "Only image files are allowed." });
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      profileImage = result.secure_url;
    }

    const userData = {
      name,
      email,
      password: hashPass,
      role: "user",
      profileImage,
    };
    const newUser = new userModel(userData);
    await newUser.save();

    res.status(200).json({ msg: "User register successfully", newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .status(200)
      .json({ msg: "Login successfully", user, accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get user Profile api

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res
      .status(200)
      .json({ msg: "Users profile get successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//update user api

exports.updateUserProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let imageUrl = null;
    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageUrl = uploadResult.secure_url;
    }
    const updateData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    };
    if (imageUrl) {
      updateData.image = imageUrl;
    }
    const updateUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updateUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "Profile update successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//book appointment api

exports.bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime, centerId } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.status(400).json({ msg: "Doctor not available" });
    }
    let slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(400).json({ msg: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      centerId,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    return res
      .status(200)
      .json({ msg: "Appointment booked", appointment: newAppointment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get user appointment list api

exports.listAppointment = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("user id", userId);
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is missing in the request." });
    }
    const appointments = await appointmentModel
      .find({ userId })
      .populate("docData");
    console.log("appointmstns", appointments);

    return res
      .status(200)
      .json({ msg: "Get user appointment list", appointments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Cancel appointment api

exports.cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.userId !== userId) {
      return res.status(400).json({ msg: "Appointment not found" });
    }
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

//Payment api
exports.paymentAppointment = async (req, res) => {
  try {
    const { amount } = req.body;
    const price = parseInt(amount * 100);
    console.log(price);
    const paymentIntent = await Stripe.paymentsIntents.create({
      amount: price,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.status(200).json({
      msg: "Payment successfully",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const { appointmentId } = req.params;
    const paymentIntent = await Stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === "succeeded") {
      const appointment = await appointmentModel.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ msg: "Appointment not found" });
      }
      appointment.payment = true;
      appointment.isCompleted = true;
      await appointment.save();
      return res.status(200).json({ msg: "Payment confirmed successfully" });
    } else {
      return res.status(400).json({ msg: "Payment confirmed not succeeded" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//update role api

exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["doctor", "diagnostic", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role Specified" });
    }
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    user.role = role;
    await user.save();
    res.status(200).json({ msg: "user role updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
