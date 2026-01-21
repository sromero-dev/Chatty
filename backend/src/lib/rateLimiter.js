import rateLimit from "express-rate-limit";

// Rate limiter para login (más estricto)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: "Demasiados intentos de login. Intenta más tarde.",
  standardHeaders: true, // Retorna info en `RateLimit-*` headers
  legacyHeaders: false, // Deshabilita `X-RateLimit-*` headers
  skip: (req) => (process.env.NODE_ENV === "production") === false, // No limitar en desarrollo
});

// Rate limiter para signup (moderado)
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por IP
  message: "Demasiados registros desde esta IP. Intenta más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => (process.env.NODE_ENV === "production") === false,
});

// Rate limiter para mensajes (permisivo)
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // máximo 30 mensajes por minuto
  message: "Estás enviando demasiados mensajes. Espera un momento.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => (process.env.NODE_ENV === "production") === false,
});
