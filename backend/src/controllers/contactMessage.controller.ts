import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ContactMessage from "../models/contactMessage.models";

// Create message (public)
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  const newMessage = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ message: "Your message has been sent.", newMessage });
});

// Admin: Get all messages
export const getAllMessages = asyncHandler(async (_req: Request, res: Response) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.status(200).json(messages);
});

// Admin: Delete a message
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404).json({ message: "Message not found" });
    return;
  }
  res.json({ message: "Message deleted" });
});
