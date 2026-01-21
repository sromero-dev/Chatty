import { body, validationResult } from "express-validator";

// Validators for signup
export const signupValidators = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain: an uppercase letter, a lowercase letter, and a number!",
    ),
];

// Validators for login
export const loginValidators = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors details:", {
      body: req.body,
      errors: errors.array(),
    });

    // Get the first error for simpler display
    const firstError = errors.array()[0];
    let userMessage = firstError.msg;

    // Improve specific error messages
    if (firstError.param === "password") {
      if (firstError.msg.includes("must contain")) {
        userMessage =
          "Password must include: an uppercase letter, a lowercase letter, and a number!";
      } else if (firstError.msg.includes("at least 6")) {
        userMessage = "Password must be at least 6 characters long!";
      }
    }

    return res.status(400).json({
      success: false,
      message: userMessage,
      // Include all errors for debugging
      allErrors: errors
        .array()
        .map((e) => ({ field: e.param, message: e.msg })),
      field: firstError.param,
    });
  }
  next();
};
