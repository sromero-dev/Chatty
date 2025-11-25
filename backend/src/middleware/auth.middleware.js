import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const protectRoute = async (req, res, next) => {
  // next is a function that calls the next middleware function
  try {
    const token = req.cookies.jwt; // jwt is the name of the cookie

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized - No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with secret key

    if (!decoded) {
      // If token is invalid
      return res
        .status(401)
        .json({ message: "Not authorized - Invalid token." });
    }

    const user = await User.findById(decoded.userId).select("-password"); // Select password from decoded cookied user

    if (!user) return res.status(401).json({ message: "User not found." }); // Returns if user does not exist

    req.user = user; // Asigns user to request

    next(); // Calls next middleware
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error);
    res.status(500).json({ message: "Server error: " + error });
  }
};
