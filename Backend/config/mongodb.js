const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/DiagnosticDB`);
};

module.exports = connectDB;
