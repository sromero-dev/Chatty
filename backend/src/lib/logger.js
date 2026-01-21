import winston from "winston";
import path from "path";

// Configurar directorio de logs
const logsDir = "logs";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "chatty-backend" },
  transports: [
    // Logs de error en archivo separado
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
    }),
    // Todos los logs en archivo general
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
    }),
  ],
});

// En desarrollo, también loguear en consola
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

export default logger;
