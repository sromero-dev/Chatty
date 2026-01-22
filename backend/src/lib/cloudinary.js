import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

// Verificar que las variables de entorno estén configuradas
const requiredEnvVars = [
  "CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  logger.error(
    `Variables de entorno de Cloudinary faltantes: ${missingEnvVars.join(", ")}`,
  );
} else {
  logger.info("Configurando Cloudinary con variables de entorno disponibles");
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // Aumentar timeout a 120 segundos
  secure: true,
});

// Función de prueba para verificar la configuración
export const testCloudinaryConfig = async () => {
  try {
    // Intentar una operación simple para verificar la configuración
    const result = await cloudinary.api.ping();
    logger.info("Configuración de Cloudinary verificada correctamente", {
      cloud_name: process.env.CLOUD_NAME,
      status: "OK",
    });
    return { success: true, message: "Cloudinary configuration verified" };
  } catch (error) {
    logger.error("Error verificando configuración de Cloudinary", {
      error: error.message,
      cloud_name: process.env.CLOUD_NAME,
    });
    return {
      success: false,
      message: `Cloudinary: ${error.message}`,
      details: error,
    };
  }
};

export default cloudinary;
