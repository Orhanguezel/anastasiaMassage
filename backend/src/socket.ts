// src/socket.ts
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import Chat from "./models/chatMessage.model";
import "dotenv/config";

interface ChatMessagePayload {
  room: string;
  message: string;
}

interface IUserToken {
  id: string;
  email: string;
  name: string;
}

export const initializeSocket = (server: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(",") || [],
      credentials: true,
    },
  });

  // 🔐 Token ile kimlik doğrulama middleware
  io.use((socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      console.log("📥 Gelen cookie:", cookieHeader);

      if (!cookieHeader) return next(new Error("No cookie found"));

      const cookies = parse(cookieHeader);
      const token = cookies["accessToken"];
      if (!token) return next(new Error("No token in cookies"));

      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as IUserToken;

      socket.data.user = decoded;
      next();
    } catch (err) {
      console.error("❌ Socket auth error:", err);
      next(new Error("Unauthorized"));
    }
  });

  // 📡 Kullanıcı bağlandığında
  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;
    const userId = user?.id;

    console.log(`🟢 Kullanıcı bağlandı: ${userId}`);

    socket.on("join-room", (roomId: string) => {
      socket.join(roomId);
      console.log(`👥 Kullanıcı ${userId} odasına katıldı: ${roomId}`);
    });

    socket.on("chat-message", async ({ room, message }: ChatMessagePayload) => {
      if (!message.trim() || !room) return;

      try {
        const newChat = await Chat.create({
          sender: userId,
          roomId: room,
          message,
        });

        const populatedChat = await newChat.populate("sender", "name email");
        const sender = populatedChat.sender as any;

        io.to(room).emit("chat-message", {
          message: populatedChat.message,
          sender: {
            _id: sender._id,
            name: sender.name,
            email: sender.email,
          },
          room: populatedChat.roomId,
          createdAt: populatedChat.createdAt,
        });

        console.log("📤 Mesaj emit edildi:", {
          message: populatedChat.message,
          sender: {
            _id: sender._id,
            name: sender.name,
            email: sender.email,
          },
          room: populatedChat.roomId,
          createdAt: populatedChat.createdAt,
        });
      } catch (err) {
        console.error("❌ Mesaj DB'ye kaydedilemedi:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Kullanıcı ayrıldı: ${userId}`);
    });
  });

  return io;
};
