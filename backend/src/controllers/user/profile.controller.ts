// src/controllers/user/profile.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../../models/user.models";
import { safelyDeleteFile } from "../../utils/fileUtils";
import { validateJsonField } from "../../utils/validation";

const PROFILE_IMAGE_DIR = "uploads/profile-images";

// ✅ Get current user's profile
export const getUserProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json(user);
});

// ✅ Update current user's profile
export const updateUserProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, addresses } = req.body;

  let parsedAddresses;
  try {
    parsedAddresses = validateJsonField(addresses, "addresses");
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { name, email, phone, addresses: parsedAddresses },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    user,
  });
});

// ✅ Update user's profile image
export const updateProfileImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Eski görseli sil
  if (user.profileImage && user.profileImage.includes("uploads/profile-images")) {
    const fileName = user.profileImage.split("/").pop();
    if (fileName) safelyDeleteFile(`${PROFILE_IMAGE_DIR}/${fileName}`);
  }

  // Yeni görseli ata
  user.profileImage = `${PROFILE_IMAGE_DIR}/${req.file.filename}`;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    profileImage: user.profileImage,
  });
});
