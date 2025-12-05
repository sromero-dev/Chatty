import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5002;

app.use(express.json()); // Allows you to parse JSON
app.use(cookieParser()); // Allows you to parse cookie (grab value out of them)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
