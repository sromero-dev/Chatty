import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { messageLimiter } from "../lib/rateLimiter.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, messageLimiter, sendMessage);

export default router;
