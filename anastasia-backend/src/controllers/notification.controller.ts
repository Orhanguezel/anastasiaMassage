// src/controllers/notification.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Notification from "../models/notification.models";

// ✅ Create Notification
export const createNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, message, type, user } = req.body;

  if (!title || !message || !type) {
    res.status(400).json({ message: "Title, message and type are required." });
    return;
  }

  const notification = await Notification.create({
    title,
    message,
    type,
    user: user || null,
  });

  res.status(201).json({ message: "Notification created", notification });
});

// ✅ Get All Notifications (Admin)
export const getAllNotifications = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const notifications = await Notification.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(notifications);
});

// ✅ Delete Notification
export const deleteNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) {
    res.status(404).json({ message: "Notification not found" });
    return;
  }

  res.json({ message: "Notification deleted successfully" });
});

