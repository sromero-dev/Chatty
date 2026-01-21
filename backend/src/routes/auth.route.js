import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { loginLimiter, signupLimiter } from "../lib/rateLimiter.js";
import {
  signupValidators,
  loginValidators,
  handleValidationErrors,
} from "../lib/validators.js";

// Express Router
const router = express.Router();

// Public Routes
router.post(
  "/signup",
  signupLimiter,
  signupValidators,
  handleValidationErrors,
  signup,
);
router.post(
  "/login",
  loginLimiter,
  loginValidators,
  handleValidationErrors,
  login,
);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
