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
    // Extract user data
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Contar total de mensajes para paginación
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
      .populate("senderId", "fullName profilePic")
      .populate("recieverId", "fullName profilePic")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    logger.info(`Retrieved ${messages.length} messages for conversation`, {
      userId: myId,
      otherUserId: userToChatId,
      page,
      limit,
      total,
    });

    res.status(200).json({
      messages,
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
        // Verificar que la imagen no contiene contenido inapropiado ANTES de procesarla
        logger.info("Checking image moderation...");
        const imageCheck = await checkImageModeration(image);
        if (!imageCheck.isAppropriate) {
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

        // Comprimir imagen si es muy grande (mayor a 1MB)
        let processedImage = image;
        if (image.length > 1024 * 1024) {
          // Si imagen > 1MB, comprimir con sharp
          const buffer = Buffer.from(image, "base64");
          const compressedBuffer = await sharp(buffer)
            .resize(1000, 1000, {
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: 80 })
            .toBuffer();
          processedImage = compressedBuffer.toString("base64");
          logger.info("Imagen comprimida exitosamente", {
            originalSize: image.length,
            compressedSize: processedImage.length,
          });
        }

        // Upload a Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${processedImage}`,
          {
            resource_type: "image",
            quality: "auto:eco",
          },
        );
        imageUrl = uploadResponse.secure_url;
        logger.info("Imagen subida a Cloudinary exitosamente", {
          url: imageUrl,
        });
      } catch (uploadError) {
        logger.error("Error subiendo imagen a Cloudinary", {
          error: uploadError.message,
        });
        return res.status(400).json({ message: "Error uploading image" });
      }
    }

    const newMessage = new Message({
      senderId: req.user._id,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "fullName profilePic")
      .populate("recieverId", "fullName profilePic");

    const recieverSocketId = getRecieverSocketId(recieverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", populatedMessage);
    }

    res.status(200).json(populatedMessage);
  } catch (error) {
    logger.error("Error sending message", { error: error.message });
    res.status(500).json({ message: "Server error: " + error });
  }
};
