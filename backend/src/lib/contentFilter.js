import { GoogleGenAI } from "@google/genai";
import logger from "./logger.js";

// Lista de palabras ofensivas/inapropiadas (fallback si Gemini no está disponible)
const OFFENSIVE_WORDS = [
  "porno",
  "xxx",
  "sexo",
  "gore",
  "muerte",
  "violencia",
  "drogas",
  "arma",
  "insulto",
  "maldición",
  "obsceno",
  "puta",
  "mierda",
];

/**
 * Filtro local de respaldo usando palabras clave (Safety Fallback)
 * @param {string} text - Texto a verificar
 * @param {string} type - Tipo de contenido: 'message' o 'username'
 * @returns {{isAppropriate: boolean, reason?: string}}
 */
const checkLocalContentModeration = (text, type = "message") => {
  const lowerText = text.toLowerCase().trim();

  if (type === "username") {
    // Verificar palabras ofensivas
    for (const word of OFFENSIVE_WORDS) {
      if (lowerText.includes(word)) {
        return {
          isAppropriate: false,
          reason: `Nombre de usuario contiene contenido restringido localmente`,
        };
      }
    }

    // Validaciones de largo
    if (lowerText.length < 2) {
      return {
        isAppropriate: false,
        reason: "Mínimo 2 caracteres",
      };
    }

    if (lowerText.length > 50) {
      return {
        isAppropriate: false,
        reason: "Máximo 50 caracteres",
      };
    }
  }

  if (type === "message") {
    // Verificar palabras muy ofensivas
    const severeWords = OFFENSIVE_WORDS.filter((w) =>
      ["porno", "xxx", "gore", "drogas", "arma"].includes(w),
    );

    for (const word of severeWords) {
      if (lowerText.includes(word)) {
        return {
          isAppropriate: false,
          reason: `Mensaje contiene lenguaje severo restringido`,
        };
      }
    }
  }

  return { isAppropriate: true };
};

/**
 * Verifica si el contenido es apropiado usando la API de Gemini
 * @param {string} text - Texto a verificar
 * @param {string} type - Tipo de contenido: 'message' o 'username'
 * @returns {Promise<{isAppropriate: boolean, reason?: string, confidence?: number}>}
 */
export const checkContentModeration = async (text, type = "message") => {
  // Si el texto está vacío, es apropiado
  if (!text || text.trim().length === 0) {
    return { isAppropriate: true };
  }

  try {
    // Si no hay API key de Gemini, usar fallback local
    if (!process.env.GEMINI_API_KEY) {
      logger.warn("GEMINI_API_KEY not configured, using local moderation");
      return checkLocalContentModeration(text, type);
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const systemPrompt = `Eres un moderador de contenido experto y estricto.
    Analiza el siguiente texto (tipo: ${type}) y determina si es inapropiado, obsceno, violento, o contiene lenguaje de odio.
    Si el tipo es 'username', sé extremadamente estricto con insinuaciones sexuales o nombres ofensivos.
    Responde ESTRICTAMENTE en formato JSON válido sin texto adicional.
    Formato esperado: {"isAppropriate": boolean, "reason": string (opcional), "confidence": number}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${systemPrompt}\n\nEvalúa este texto: "${text}"`,
    });

    const responseText = response.text.trim();
    logger.debug("Gemini moderation response", {
      type,
      textLength: text.length,
      response: responseText,
    });

    // Parsear la respuesta JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      logger.error("Failed to parse Gemini response as JSON", {
        response: responseText,
        error: parseError.message,
      });
      // Si no se puede parsear, usar fallback
      return checkLocalContentModeration(text, type);
    }

    // Validar estructura de respuesta
    if (typeof result.isAppropriate !== "boolean") {
      logger.warn("Invalid Gemini response structure", { result });
      return checkLocalContentModeration(text, type);
    }

    // Si se detectó contenido inapropiado
    if (!result.isAppropriate) {
      logger.warn("Content flagged by Gemini moderation", {
        type,
        reason: result.reason,
        confidence: result.confidence,
        text: text.substring(0, 100),
      });
    }

    return result;
  } catch (error) {
    logger.error("Gemini Moderation Error, falling back to local", {
      error: error.message,
      type,
    });
    // En caso de error, usar fallback local como medida de seguridad
    return checkLocalContentModeration(text, type);
  }
};

/**
 * Valida múltiples campos de contenido
 * @param {object} fields - Objeto con los campos a validar
 * @returns {Promise<{isAppropriate: boolean, errors: string[]}>}
 */
export const validateContentFields = async (fields) => {
  const errors = [];

  // Procesar todos los campos en paralelo
  const promises = Object.entries(fields).map(
    async ([fieldName, fieldValue]) => {
      if (!fieldValue) return;

      const type = ["fullName", "username", "name"].includes(fieldName)
        ? "username"
        : "message";

      const result = await checkContentModeration(fieldValue, type);

      if (!result.isAppropriate) {
        errors.push(
          `${fieldName}: ${result.reason || "Contenido no permitido"}`,
        );
      }
    },
  );

  await Promise.all(promises);

  return {
    isAppropriate: errors.length === 0,
    errors,
  };
};

/**
 * Verifica si una imagen contiene contenido inapropiado usando Gemini Vision
 * @param {string} imageBase64 - Imagen en formato base64 (con o sin prefijo data:)
 * @returns {Promise<{isAppropriate: boolean, reason?: string, confidence?: number}>}
 */
export const checkImageModeration = async (imageBase64) => {
  if (!imageBase64 || imageBase64.trim().length === 0) {
    return { isAppropriate: true };
  }

  try {
    // Si no hay API key de Gemini, usar fallback (aceptar imagen)
    if (!process.env.GEMINI_API_KEY) {
      logger.warn(
        "GEMINI_API_KEY not configured, accepting image without moderation",
      );
      return { isAppropriate: true };
    }

    // Limpiar el prefijo data: si está presente
    let cleanBase64 = imageBase64;
    if (imageBase64.includes(",")) {
      cleanBase64 = imageBase64.split(",")[1];
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const systemPrompt = `Eres un moderador de contenido visual experto y EXTREMADAMENTE ESTRICTO.
    Analiza la imagen y determina si contiene contenido inapropiado, obsceno, violento, sexual, gore, o drogas.
    Sé SEVERO con cualquier tipo de contenido sexual, desnudez, violencia gráfica o gore.
    Responde ESTRICTAMENTE en formato JSON válido sin texto adicional.
    Formato esperado: {"isAppropriate": boolean, "reason": string (solo si es inapropiada), "confidence": number}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        systemPrompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64,
          },
        },
        "Evalúa esta imagen en términos de seguridad y contenido apropiado.",
      ],
    });

    const responseText = response.text.trim();
    logger.debug("Gemini image moderation response", {
      response: responseText,
    });

    // Parsear la respuesta JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      logger.error("Failed to parse image moderation response as JSON", {
        response: responseText,
        error: parseError.message,
      });
      // En caso de error al parsear, aceptar la imagen por seguridad
      return { isAppropriate: true };
    }

    // Validar estructura de respuesta
    if (typeof result.isAppropriate !== "boolean") {
      logger.warn("Invalid image moderation response structure", { result });
      return { isAppropriate: true };
    }

    // Si se detectó contenido inapropiado
    if (!result.isAppropriate) {
      logger.warn("Image flagged by Gemini moderation", {
        reason: result.reason,
        confidence: result.confidence,
      });
    }

    return result;
  } catch (error) {
    logger.error("Gemini Image Moderation Error", {
      error: error.message,
    });
    // En caso de error, aceptar la imagen por seguridad
    return { isAppropriate: true };
  }
};

export default checkContentModeration;
