const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/mongodb");
const connectCloudinary = require("./config/cloudinary");
const adminRouter = require("./routes/adminROutes");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const testRouter = require("./routes/testRoutes");
const invoiceRouter = require("./routes/invoiceRoutes");

const app = express();
const port = process.env.PORT || 5001;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

//api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/tests", testRouter);
app.use("/api/invoice", invoiceRouter);

app.get("", (req, res) => {
  res.send("Running Api in port");
});

app.listen(port, () => {
  console.log("server started", port);
});
