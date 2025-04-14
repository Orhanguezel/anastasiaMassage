// src/controllers/user/crud.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../../models/user.models";
import {
  isValidObjectId,
  getUserOrFail,
  validateJsonField,
} from "../../utils/validation";
import { safelyDeleteFile } from "../../utils/fileUtils"; // yeni yardımcı dosya olabilir

const PROFILE_IMAGE_DIR = "uploads/profile-images";

// ✅ Get All Users
export const getUsers = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

// ✅ Get User by ID
export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid user ID format" });
    return;
  }

  const user = await getUserOrFail(id, res);
  if (!user) return;

  res.status(200).json(user);
});

// ✅ Update User
export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    name,
    email,
    role,
    isActive,
    phone,
    bio,
    birthDate,
    socialMedia,
    notifications,
    addresses,
    oldProfileImage,
  } = req.body;

  const user = await getUserOrFail(id, res);
  if (!user) return;

  // Profil görseli güncellemesi
  let profileImage = user.profileImage;
  if (req.file) {
    profileImage = `${process.env.BASE_URL}/uploads/profile-images/${req.file.filename}`;
    if (oldProfileImage?.includes("uploads/profile-images")) {
      const oldPath = `${PROFILE_IMAGE_DIR}/${oldProfileImage.split("/").pop()}`;
      safelyDeleteFile(oldPath);
    }
  }

  // Alanları güncelle
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      role,
      isActive: isActive === "true" || isActive === true,
      phone,
      bio,
      birthDate: birthDate ? new Date(birthDate) : null,
      socialMedia: validateJsonField(socialMedia, "socialMedia"),
      notifications: validateJsonField(notifications, "notifications"),
      addresses: validateJsonField(addresses, "addresses"),
      profileImage,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});

// ✅ Delete User
export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid user ID format" });
    return;
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    userId: id,
  });
});
