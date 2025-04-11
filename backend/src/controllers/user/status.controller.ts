// src/controllers/user/status.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../../models/user.models";

// Toggle user status (active/inactive)
export const toggleUserStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (
      !id ||
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id.trim())
    ) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const user = await User.findById(id.trim());
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User successfully ${user.isActive ? "activated" : "blocked"}`,
      userId: String(user._id),
      isActive: user.isActive,
    });
  }
);

// Update user role
export const updateUserRole = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user", "moderator", "customer", "staff"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Role updated successfully", user });
  }
);
