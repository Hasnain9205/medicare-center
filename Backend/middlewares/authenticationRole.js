const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authenticationRole = (roles) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        expiredIn: "10m",
      });
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "Invalid token." });
      }

      req.user = { id: user._id, role: user.role };
      console.log("User found:", req.user);
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message:
            "Access denied. You do not have permission to access this resource.",
        });
      }
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token error." });
    }
  };
};

module.exports = { authenticationRole };
