const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");

const authenticationRole = (roles) => {
  return async (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Extracted Token:", token);
    console.log("Headers received on backend:", req.headers);

    // If no token is provided, return a 401 error
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check which model the user belongs to (Doctor, Admin, or User)
      let user;

      if (decoded.role === "doctor") {
        user = await doctorModel.findById(decoded.id); // Find doctor by ID
      } else {
        user = await userModel.findById(decoded.id); // Find user by ID
      }

      // If no user is found, return an error
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid token. User not found." });
      }

      // Attach user details to the request object
      req.user = user;

      // Check if the user's role is allowed to access this route
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message:
            "Access denied. You do not have permission to access this resource.",
        });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // If token verification fails, handle error
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token has expired. Please log in again." });
      }
      return res.status(400).json({ message: "Invalid token error." });
    }
  };
};

module.exports = { authenticationRole };
