import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import ChatMessage from "../models/chatMessage.model";
import mongoose from "mongoose";

// 📥 GET /chat/:roomId - Belirli odaya ait tüm mesajlar
export const getMessagesByRoom = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;
  
    const messages = await ChatMessage.find({ roomId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 }); // ✅ createdAt kullanılmalı
  
    res.status(200).json(messages);
  });
  
  // 📥 GET /chat - Tüm odaların son mesajlarını getir (admin için)
  export const getAllRoomsLastMessages = asyncHandler(async (_req: Request, res: Response) => {
    const latestMessages = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } }, // ✅ createdAt kullanılmalı
      {
        $group: {
          _id: "$roomId",
          latestMessage: { $first: "$$ROOT" },
        },
      },
    ]);
  
    res.status(200).json(latestMessages);
  });
  

// 🗑️ DELETE /chat/:id - Tek bir mesaj sil (admin/moderator)
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await ChatMessage.findByIdAndDelete(req.params.id);

  if (!message) {
    res.status(404).json({ message: "Message not found" });
    return;
  }

  res.status(200).json({ message: "Message deleted successfully" });
});

// 🗑️ DELETE /chat/bulk - Belirli mesajları toplu sil
export const deleteMessagesBulk = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || !ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
    res.status(400).json({ message: "Invalid or missing message IDs" });
    return;
  }

  const result = await ChatMessage.deleteMany({ _id: { $in: ids } });

  res.status(200).json({ message: `${result.deletedCount} message(s) deleted successfully` });
});

// 📤 POST /chat/manual - Admin el ile mesaj gönderebilir
export const sendManualMessage = asyncHandler(async (req: Request, res: Response) => {
  const { roomId, message } = req.body;
  const senderId = req.user?.id;

  if (!roomId || !message || !senderId) {
    res.status(400).json({ message: "Missing roomId, message or sender" });
    return;
  }

  const newMessage = await ChatMessage.create({
    roomId,
    sender: senderId,
    message,
  });

  res.status(201).json({ message: "Message sent", data: newMessage });
});

