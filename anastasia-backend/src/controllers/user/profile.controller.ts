// src/controllers/user/profile.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import User from "../../models/user.models";

// Get logged-in user's profile
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  }
);

// Update user's own profile
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, addresses } = req.body;

    const updatedFields = { name, email, phone, addresses };

    const user = await User.findByIdAndUpdate(req.user.id, updatedFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user,
    });
  }
);

// Update user's profile image
export const updateProfileImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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

    if (user.profileImage && user.profileImage.startsWith("uploads")) {
      const oldImagePath = path.join(process.cwd(), user.profileImage);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    user.profileImage = `uploads/profile-images/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  }
);
