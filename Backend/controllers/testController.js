const userModel = require("../models/userModel");
const testModel = require("../models/testModel");
const testAppointmentModel = require("../models/testAppointmentModel");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// Create Test
exports.createTest = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    if (!name || !category || !price || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newTest = await testModel.create({
      name,
      image: req.file.path, // Assume middleware handles file uploads
      category,
      price,
      description,
    });

    res
      .status(201)
      .json({ message: "Test created successfully", test: newTest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating test", error: error.message });
  }
};

// Get Test by ID
exports.getTestById = async (req, res) => {
  try {
    const test = await testModel.findById(req.params.testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json({ message: "Test fetched successfully", test });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching test", error: error.message });
  }
};

// Get All Tests
exports.getAllTest = async (req, res) => {
  try {
    const tests = await testModel.find();
    res.status(200).json({ message: "Tests fetched successfully", tests });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tests", error: error.message });
  }
};

// Update Test
exports.updateTest = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;

    const updates = { name, category, price, description };

    if (req.file) {
      updates.image = req.file.path;
    }

    const updatedTest = await testModel.findByIdAndUpdate(
      req.params.testId,
      updates,
      {
        new: true,
      }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res
      .status(200)
      .json({ message: "Test updated successfully", test: updatedTest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating test", error: error.message });
  }
};

// Cancel Test Appointment
exports.cancelTest = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await testAppointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Cannot cancel an appointment that is already paid.",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res
      .status(200)
      .json({ message: "Test appointment cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling test", error: error.message });
  }
};

//book test
exports.bookTest = async (req, res) => {
  const {
    userId,
    testId,
    appointmentDate,
    appointmentTime,
    paymentStatus = "unpaid",
  } = req.body;

  try {
    if (!userId || !testId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        message:
          "All fields are required: userId, testId, appointmentDate, appointmentTime.",
      });
    }

    // Validate user and test existence
    const [user, test] = await Promise.all([
      userModel.findById(userId),
      testModel.findById(testId),
    ]);

    if (!user) return res.status(404).json({ message: "User not found." });
    if (!test) return res.status(404).json({ message: "Test not found." });

    // Check for existing appointment
    const existingAppointment = await testAppointmentModel.findOne({
      testId,
      appointmentDate,
      appointmentTime,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "The test is already booked for this date and time.",
      });
    }

    const newAppointment = await testAppointmentModel.create({
      userId,
      testId,
      appointmentDate,
      appointmentTime,
      status: paymentStatus === "paid" ? "booked" : "pending",
      paymentStatus,
    });

    res.status(201).json({
      message: "Test booked successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error booking test",
      error: error.message,
    });
  }
};

//Get test appointment
exports.getTestAppointment = async (req, res) => {
  try {
    const testAppointments = await testAppointmentModel
      .find({})
      .populate("testId", "name price category");

    // Log to check if data is fetched correctly
    console.log(testAppointments);

    return res
      .status(200)
      .json({ msg: "All appointment get successfully", testAppointments });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

exports.updateTestAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params; // Appointment ID
    const { status } = req.body; // New status

    const validStatuses = ["pending", "booked", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const appointment = await testAppointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: `Appointment status updated to ${status}`,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating appointment status",
      error: error.message,
    });
  }
};

exports.payment = async (req, res) => {
  const { unpaidAppointments } = req.body;

  // Calculate the total amount for all unpaid appointments
  const totalAmount = unpaidAppointments.reduce((total, appointment) => {
    const price = appointment.testId?.price;
    if (isNaN(price) || price <= 0) {
      return total; // If price is invalid, just return the total so far
    }
    return total + price;
  }, 0);

  // Convert amount to the smallest currency unit (cents for USD)
  const amountInCents = totalAmount * 100;

  try {
    // Create a payment intent with the total amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd", // Adjust to your preferred currency
      payment_method_types: ["card"],
    });

    // Send the client secret to the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.paymentSuccess = async (req, res) => {
  const { appointmentIds, sessionId } = req.body;

  try {
    // Verify the session ID and retrieve payment intent details
    const paymentIntent = await stripe.paymentIntents.retrieve(sessionId);

    // Check the payment intent status
    if (paymentIntent.status === "succeeded") {
      // Update appointment status as paid in your database
      await testAppointmentModel.updateMany(
        { _id: { $in: appointmentIds } },
        { $set: { status: "booked", paymentStatus: "paid" } }
      );

      res.status(200).send("Payment and appointment update successful");
    } else {
      res.status(400).send("Payment not successful");
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).send("Error processing payment");
  }
};

exports.paymentHistory = async (req, res) => {
  const userId = req.user.id; // Assuming you're using JWT for authentication

  try {
    // Fetch payment details for all appointments of the logged-in user
    const appointments = await testAppointmentModel
      .find({ userId })
      .populate("testId", "name price") // Populate test details
      .populate("docId", "name specialty address fees") // Populate doctor details
      .sort({ createdAt: -1 }); // Sort by the most recent

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No payment history found." });
    }

    const paymentDetails = appointments.map((appointment) => ({
      ...appointment._doc,
      paymentStatus: appointment.paymentStatus || "Pending", // Default to "Pending" if no payment status
      paymentInfo: appointment.paymentIntentId
        ? { paymentIntentId: appointment.paymentIntentId }
        : {},
    }));

    res.status(200).json({
      message: "Payment history fetched successfully",
      payments: paymentDetails,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ message: "Error fetching payment history" });
  }
};
