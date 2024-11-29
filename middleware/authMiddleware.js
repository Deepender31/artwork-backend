const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.id; // Assuming the token contains the user ID
    next();
  });
};

exports.artistAuthMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Check if the user is an artist
    if (decoded.role !== "artist") {
      return res.status(403).json({ message: "Forbidden: Not an artist" });
    }
    req.userId = decoded.id; // Assuming the token contains the user ID

    User.findById(decoded.id, (err, user) => {
      if (err || !user) {
        return res.status(404).json({ message: "User not found" });
      }
    });
    next();
  });
};

// Normal user authentication middleware
exports.userAuthMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Check if the user is a normal user
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Forbidden: Not a normal user" });
    }
    req.userId = decoded.id; // Assuming the token contains the user ID

    User.findById(decoded.id, (err, user) => {
      if (err || !user) {
        return res.status(404).json({ message: "User not found" });
      }
    });
    next();
  });
};
