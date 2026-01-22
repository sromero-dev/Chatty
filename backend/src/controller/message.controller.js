import User from "../model/user.model.js";
import Message from "../model/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";
import logger from "../lib/logger.js";
import sharp from "sharp";
import {
  checkContentModeration,
  checkImageModeration,
} from "../lib/contentFilter.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      // Find all users except the logged in user
      _id: { $ne: loggedInUserId },
    }).select("-password"); // Select password from decoded cookied user

    logger.info(`Retrieved ${filteredUsers.length} users for sidebar`);
    res.status(200).json(filteredUsers); // Returns filtered users
  } catch (error) {
    logger.error("Error retrieving users for sidebar", {
      error: error.message,
    });
    res.status(500).json({ message: "Server error: " + error });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const total = await Message.countDocuments({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    })
      .populate("senderId", "_id fullName profilePic")
      .populate("recieverId", "_id fullName profilePic")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    // Convertir todo a objetos simples con IDs como strings
    const messagesForFrontend = messages.map((msg) => {
      const messageObj = msg.toObject();

      // Convertir _id a string
      messageObj._id = messageObj._id.toString();

      // Convertir senderId
      if (messageObj.senderId && messageObj.senderId._id) {
        messageObj.senderId = {
          ...messageObj.senderId,
          _id: messageObj.senderId._id.toString(),
        };
      }

      // Convertir recieverId
      if (messageObj.recieverId && messageObj.recieverId._id) {
        messageObj.recieverId = {
          ...messageObj.recieverId,
          _id: messageObj.recieverId._id.toString(),
        };
      }

      return messageObj;
    });

    logger.info(`Retrieved ${messages.length} messages for conversation`, {
      userId: myId.toString(),
      otherUserId: userToChatId,
      page,
      limit,
      total,
    });

    res.status(200).json({
      messages: messagesForFrontend,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Error retrieving messages", { error: error.message });
    res.status(500).json({ message: "Server error: " + error });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;

    // Validate that at least text or image is provided
    if (!text?.trim() && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    // Verificar que el contenido del mensaje no sea inapropiado
    if (text?.trim()) {
      const contentCheck = await checkContentModeration(text, "message");
      if (!contentCheck.isAppropriate) {
        logger.warn("Message rejected: inappropriate content", {
          senderId: req.user._id,
          recieverId,
          reason: contentCheck.reason,
        });
        return res.status(400).json({
          message:
            contentCheck.reason ||
            "Mensaje rechazado: contiene contenido inapropiado",
        });
      }
    }

    let imageUrl;
    if (image) {
      try {
        // Verificar tamaño de imagen antes de procesar (10MB máximo)
        const imageSize = Buffer.byteLength(image, "base64");
        const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

        if (imageSize > MAX_IMAGE_SIZE) {
          logger.warn("Image too large for processing", {
            size: imageSize,
            maxSize: MAX_IMAGE_SIZE,
          });
          return res.status(400).json({
            message: `La imagen es demasiado grande. Máximo permitido: ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
          });
        }

        let imageCheck;
        try {
          // Intentar moderación
          logger.info("Checking image moderation...");
          imageCheck = await checkImageModeration(image);
        } catch (moderationError) {
          // Si hay error inesperado, permitir la imagen con advertencia
          logger.warn("Image moderation failed, allowing image with warning", {
            error: moderationError.message,
          });
          imageCheck = {
            isAppropriate: true,
            reason: "Moderation service temporarily unavailable",
            bypassed: true,
          };
        }

        // Solo rechazar si la moderación funcionó Y detectó contenido inapropiado
        // Y NO fue bypassed
        if (
          imageCheck.isAppropriate === false &&
          imageCheck.bypassed !== true
        ) {
          logger.warn("Image rejected: inappropriate content", {
            senderId: req.user._id,
            recieverId,
            reason: imageCheck.reason,
          });
          return res.status(400).json({
            message:
              imageCheck.reason ||
              "Imagen rechazada: contiene contenido inapropiado (sexual, violencia, gore, etc.)",
          });
        }

        // Si la moderación fue bypassed (por cuota, error, tamaño, etc.), registrar advertencia
        if (imageCheck.bypassed) {
          logger.warn("Image moderation bypassed", {
            reason: imageCheck.reason,
            senderId: req.user._id,
            recieverId,
            imageSize: `${(imageSize / (1024 * 1024)).toFixed(2)}MB`,
          });
        }

        // Comprimir imagen si es muy grande (mayor a 1MB)
        let processedImage = image;
        let compressionInfo = { compressed: false };
        if (image.length > 1024 * 1024) {
          try {
            const buffer = Buffer.from(image, "base64");
            const compressedBuffer = await sharp(buffer)
              .resize(1000, 1000, {
                fit: "inside",
                withoutEnlargement: true,
              })
              .jpeg({ quality: 80 })
              .toBuffer();
            processedImage = compressedBuffer.toString("base64");
            compressionInfo = {
              compressed: true,
              originalSize: image.length,
              compressedSize: processedImage.length,
              reduction: `${((1 - processedImage.length / image.length) * 100).toFixed(1)}%`,
            };
            logger.info("Imagen comprimida exitosamente", compressionInfo);
          } catch (compressionError) {
            logger.warn("Error comprimiendo imagen, usando original", {
              error: compressionError.message,
            });
            // Continuar con imagen original si falla la compresión
          }
        }

        // Upload a Cloudinary - con mejor manejo de errores
        try {
          logger.info("Intentando subir imagen a Cloudinary...");

          // Verificar que processedImage sea válido
          if (!processedImage || processedImage.trim().length === 0) {
            throw new Error("Base64 de imagen vacío o inválido");
          }

          // Extraer solo el base64 si tiene prefijo data:image
          let cleanBase64 = processedImage;
          if (processedImage.includes(",")) {
            cleanBase64 = processedImage.split(",")[1];
          }

          // Verificar que el base64 sea válido
          if (cleanBase64.length < 100) {
            logger.warn("Base64 de imagen muy corto, puede ser inválido", {
              length: cleanBase64.length,
            });
          }

          const uploadResponse = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${cleanBase64}`,
            {
              resource_type: "image",
              quality: "auto:eco",
              timeout: 120000,
            },
          );

          imageUrl = uploadResponse.secure_url;
          logger.info("Imagen subida a Cloudinary exitosamente", {
            url: imageUrl.substring(0, 100) + "...",
            moderated: !imageCheck.bypassed,
            bypassReason: imageCheck.bypassed ? imageCheck.reason : null,
            ...compressionInfo,
          });
        } catch (uploadError) {
          // Obtener información detallada del error
          const errorDetails = {
            message: uploadError.message || "Sin mensaje de error",
            name: uploadError.name || "UnknownError",
            http_code: uploadError.http_code || "N/A",
            http_status: uploadError.http_status || "N/A",
            stack: uploadError.stack || "No stack trace",
          };

          // Intentar extraer más información si está disponible
          if (uploadError.error) {
            errorDetails.cloudinary_error = uploadError.error;
          }

          if (uploadError.response && uploadError.response.error) {
            errorDetails.cloudinary_response = uploadError.response.error;
          }

          logger.error(
            "Error detallado subiendo imagen a Cloudinary",
            errorDetails,
          );

          // Intentar fallback: guardar imagen localmente o usar otro método
          logger.warn("Intentando fallback para imagen...");

          // Si estamos en desarrollo, intentar guardar localmente
          if (process.env.NODE_ENV === "development") {
            try {
              // Guardar imagen temporalmente en el sistema de archivos
              const fs = require("fs");
              const path = require("path");

              const uploadsDir = path.join(__dirname, "../uploads");
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const filename = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
              const filepath = path.join(uploadsDir, filename);

              const buffer = Buffer.from(cleanBase64, "base64");
              fs.writeFileSync(filepath, buffer);

              // Crear URL local para desarrollo
              imageUrl = `/uploads/${filename}`;
              logger.info("Imagen guardada localmente como fallback", {
                path: filepath,
                url: imageUrl,
              });
            } catch (fallbackError) {
              logger.error("Fallback también falló", {
                error: fallbackError.message,
              });

              return res.status(400).json({
                message:
                  "Error crítico procesando imagen. Por favor, intenta con una imagen más pequeña o diferente.",
                detail: "Servicio de almacenamiento no disponible",
              });
            }
          } else {
            // En producción, dar un mensaje más genérico
            return res.status(400).json({
              message:
                "Error procesando la imagen. Por favor, intenta con una imagen más pequeña.",
              detail: errorDetails.message,
            });
          }
        }
      } catch (error) {
        logger.error("Error general procesando imagen", {
          error: error.message,
          stack: error.stack,
        });
        return res.status(400).json({
          message:
            "Error procesando la imagen. Por favor, intenta con otra imagen.",
        });
      }
    }

    // CREAR NUEVO MENSAJE
    const newMessage = new Message({
      senderId: req.user._id,
      recieverId,
      text: text?.trim() || "",
      image: imageUrl,
    });

    await newMessage.save();

    // POPULAR Y PREPARAR MENSAJE PARA FRONTEND
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "_id fullName profilePic")
      .populate("recieverId", "_id fullName profilePic");

    if (!populatedMessage) {
      throw new Error("Error al crear el mensaje");
    }

    // Convertir los ObjectId a strings para el frontend
    const messageForFrontend = {
      ...populatedMessage.toObject(),
      _id: populatedMessage._id.toString(),
      senderId: populatedMessage.senderId
        ? {
            ...populatedMessage.senderId.toObject(),
            _id: populatedMessage.senderId._id.toString(),
          }
        : null,
      recieverId: populatedMessage.recieverId
        ? {
            ...populatedMessage.recieverId.toObject(),
            _id: populatedMessage.recieverId._id.toString(),
          }
        : null,
    };

    // ENVIAR MENSAJE POR SOCKET
    const recieverSocketId = getRecieverSocketId(recieverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", messageForFrontend);
    }

    // ENVIAR RESPUESTA
    res.status(200).json(messageForFrontend);
  } catch (error) {
    logger.error("Error sending message", {
      error: error.message,
      stack: error.stack,
    });

    // Manejar error de tamaño de payload específicamente
    if (error.message && error.message.includes("PayloadTooLargeError")) {
      return res.status(413).json({
        message:
          "Image is too large (10mb max). Please try again with a smaller image.",
      });
    }

    res.status(500).json({
      message: "Server error sending message",
    });
  }
};
