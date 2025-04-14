// src/controllers/notification.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Notification from "../models/notification.models";

// 🔔 Create a new notification
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

  res.status(201).json({ message: "Notification created successfully", notification });
});

// 📋 Get all notifications (Admin only)
export const getAllNotifications = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const notifications = await Notification.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

// 🗑️ Delete a notification by ID
export const deleteNotification = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid notification ID." });
    return;
  }

  const notification = await Notification.findByIdAndDelete(id);
  if (!notification) {
    res.status(404).json({ message: "Notification not found." });
    return;
  }

  res.status(200).json({ message: "Notification deleted successfully." });
});

// ✅ Mark a single notification as read
export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid notification ID." });
    return;
  }

  const notification = await Notification.findById(id);
  if (!notification) {
    res.status(404).json({ message: "Notification not found." });
    return;
  }

  notification.isRead = true;
  await notification.save();

  res.json({ message: "Notification marked as read.", notification });
});

// ✅ Mark all notifications as read
export const markAllNotificationsAsRead = asyncHandler(async (_req: Request, res: Response) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.json({ message: "All notifications have been marked as read." });
});

