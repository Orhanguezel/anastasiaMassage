// src/controllers/user/crud.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import User from "../../models/user.models";

const BASE_UPLOAD_DIR = "uploads";
const PROFILE_IMAGE_FOLDER = "profile-images";

// Get All Users
export const getUsers = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  }
);

// Get User by ID
export const getUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  }
);

// Update User
export const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    let {
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

    addresses = addresses ? JSON.parse(addresses) : [];
    socialMedia = socialMedia ? JSON.parse(socialMedia) : {};
    notifications = notifications ? JSON.parse(notifications) : {};

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    let profileImage = user.profileImage;
    if (req.file) {
      profileImage = `${process.env.BASE_URL}/uploads/profile-images/${req.file.filename}`;
      if (
        oldProfileImage &&
        oldProfileImage.includes("/uploads/profile-images/")
      ) {
        const oldImagePath = path.join(
          "uploads/profile-images",
          path.basename(oldProfileImage)
        );
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
        isActive: isActive === "true",
        phone,
        bio,
        birthDate: birthDate || null,
        socialMedia,
        notifications,
        addresses,
        profileImage,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  }
);

// Delete User
export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully", userId: id });
  }
);
