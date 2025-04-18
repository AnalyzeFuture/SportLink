import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Protect route checks if the user is logged in or not
const protectRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies.jwt || // Check for token in cookies
      req.headers.authorization?.split(" ")[1]; // Check for token in Authorization header

    console.log("Token received:", token); // Debugging token

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debugging decoded token

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in protectRoute: ", err.message);
  }
};

export default protectRoute;
