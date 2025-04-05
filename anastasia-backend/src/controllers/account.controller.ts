import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.models";

// ✅ Get Logged-in User Profile
export const getMyProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?._id).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(user);
});

// ✅ Update User Profile
export const updateMyProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const { name, email, phone } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  const updatedUser = await user.save();

  res.json({
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
    },
  });
});

// ✅ Update User Password
export const updateMyPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.user?._id).select("+password");


  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const { currentPassword, newPassword } = req.body;

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(400).json({ message: "Current password is incorrect" });
    return;
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

export const updateNotificationSettings = asyncHandler(async (req: Request, res: Response) => {
  const { emailNotifications, smsNotifications } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  user.notifications = {
    emailNotifications: emailNotifications ?? user.notifications?.emailNotifications,
    smsNotifications: smsNotifications ?? user.notifications?.smsNotifications,
  };

  await user.save();
  res.json({ message: "Notification preferences updated", notifications: user.notifications });
});


export const updateSocialMediaLinks = asyncHandler(async (req: Request, res: Response) => {
  const { facebook, instagram, twitter } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  user.socialMedia = {
    facebook: facebook ?? user.socialMedia?.facebook,
    instagram: instagram ?? user.socialMedia?.instagram,
    twitter: twitter ?? user.socialMedia?.twitter,
  };

  await user.save();
  res.json({ message: "Social media links updated", socialMedia: user.socialMedia });
});


