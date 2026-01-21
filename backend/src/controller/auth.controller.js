import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import logger from "../lib/logger.js";
import { checkContentModeration } from "../lib/contentFilter.js";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    console.log("Signup attempt:", {
      email,
      fullName,
      passwordLength: password?.length,
    });

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("Signup failed: User already exists", { email });
      return res.status(400).json({ message: "User already exists" });
    }

    // Check content moderation for full name
    try {
      const nameCheck = await checkContentModeration(fullName, "username");
      if (!nameCheck.isAppropriate) {
        logger.warn("Signup rejected: inappropriate full name", {
          email,
          reason: nameCheck.reason,
        });
        return res
          .status(400)
          .json({ message: nameCheck.reason || "Inappropriate name" });
      }
    } catch (error) {
      logger.error("Error checking username", {
        email,
        error: error.message,
      });
      return res
        .status(500)
        .json({ message: "Server content filtering error" });
    }

    // Hash password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    generateToken(newUser._id, res);

    logger.info("User signup successful", {
      userId: newUser._id,
      email: newUser.email,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Error signing up user", {
      error: error.message,
      email,
      stack: error.stack,
    });
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login attempt:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Login failed: User not found", { email });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn("Login failed: Invalid password", { email });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    logger.info("User login successful", {
      userId: user._id,
      email: user.email,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Error logging in user", {
      error: error.message,
      email,
      stack: error.stack,
    });
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    if (req.user) {
      logger.info("User logout successful", { userId: req.user._id });
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    logger.error("Error logging out user", {
      error: error.message,
      userId: req.user?._id,
    });
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    if (!cloudinary.config().cloud_name) {
      console.error("Cloudinary is not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "public",
      resource_type: "image",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Cloudinary Error updating profile:", error);
    logger.error("Error updating profile", {
      userId: req.user?._id,
      error: error.message,
    });
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      message: "User authenticated",
      user: req.user,
    });
  } catch (error) {
    console.error("Error checking auth:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
