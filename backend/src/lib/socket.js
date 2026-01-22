import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    // Asegurar que el userId se almacena como string
    userSocketMap[userId.toString()] = socket.id;
  }

  // Enviar IDs como strings
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    if (userId) {
      delete userSocketMap[userId.toString()];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export function getRecieverSocketId(recieverId) {
  // Asegurar que buscamos con string
  return userSocketMap[recieverId.toString()];
}

export { io, app, server };
