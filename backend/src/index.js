import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import { testCloudinaryConfig } from "./lib/cloudinary.js";
import logger from "./lib/logger.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "10mb" })); // Allows you to parse JSON
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser()); // Allows you to parse cookie (grab value out of them)
app.use(compression()); // Gzip compression for production

// CORS configuration - Allow both local and production URLs
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:3000", // Local production
  process.env.FRONTEND_URL || "", // Production frontend URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Servir archivos estáticos del frontend (build de Vite)
const frontendDistPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDistPath));

// SPA fallback - redirigir todas las rutas a index.html
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

server.listen(PORT, async () => {
  logger.info(`Server is running on http://localhost:${PORT}`, {
    environment: process.env.NODE_ENV,
    port: PORT,
  });

  await connectDB();

  // Probar configuración de Cloudinary
  if (process.env.CLOUD_NAME) {
    const cloudinaryTest = await testCloudinaryConfig();
    if (!cloudinaryTest.success) {
      logger.error(
        "ADVERTENCIA: Cloudinary no está configurado correctamente",
        cloudinaryTest,
      );
    }
  } else {
    logger.warn(
      "CLOUD_NAME no configurado. Las imágenes no se podrán subir a Cloudinary.",
    );
  }
});
