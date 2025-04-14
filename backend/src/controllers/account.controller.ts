// src/controllers/account.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.models";
import { getUserOrFail } from "../utils/validation";
import { checkPassword, hashNewPassword } from "../services/authService";

// ✅ Get Logged-in User Profile
export const getMyProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await getUserOrFail(req.user!.id, res);
  if (!user) return;

  res.status(200).json(user);
});

// ✅ Update Basic Profile Info
export const updateMyProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await getUserOrFail(req.user!.id, res);
  if (!user) return;

  const { name, email, phone } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    },
  });
});

// ✅ Update Password
export const updateMyPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id).select("+password");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const { currentPassword, newPassword } = req.body;

  const isMatch = await checkPassword(currentPassword, user.password);
  if (!isMatch) {
    res.status(400).json({ message: "Current password is incorrect" });
    return;
  }

  user.password = await hashNewPassword(newPassword);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

// ✅ Update Notification Settings
export const updateNotificationSettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { emailNotifications, smsNotifications } = req.body;

  const user = await getUserOrFail(req.user!.id, res);
  if (!user) return;

  user.notifications = {
    emailNotifications: emailNotifications ?? user.notifications?.emailNotifications,
    smsNotifications: smsNotifications ?? user.notifications?.smsNotifications,
  };

  await user.save();

  res.status(200).json({
    message: "Notification preferences updated",
    notifications: user.notifications,
  });
});

// ✅ Update Social Media Links
export const updateSocialMediaLinks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { facebook, instagram, twitter } = req.body;

  const user = await getUserOrFail(req.user!.id, res);
  if (!user) return;

  user.socialMedia = {
    facebook: facebook ?? user.socialMedia?.facebook,
    instagram: instagram ?? user.socialMedia?.instagram,
    twitter: twitter ?? user.socialMedia?.twitter,
  };

  await user.save();

  res.status(200).json({
    message: "Social media links updated",
    socialMedia: user.socialMedia,
  });
});
