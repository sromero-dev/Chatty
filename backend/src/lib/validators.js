import { body, validationResult } from "express-validator";

// Validadores para signup
export const signupValidators = [
  body("email").isEmail().withMessage("Email no es válido").normalizeEmail(),
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe contener mayúscula, minúscula y número"),
];

// Validadores para login
export const loginValidators = [
  body("email").isEmail().withMessage("Email no es válido").normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
];

// Middleware para manejar errores de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Errores de validación",
      errors: errors.array(),
    });
  }
  next();
};
