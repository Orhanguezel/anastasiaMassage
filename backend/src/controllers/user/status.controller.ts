// src/controllers/user/status.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../../models/user.models";
import {
  isValidObjectId,
  getUserOrFail,
  isValidRole,
} from "../../utils/validation";

// ✅ Kullanıcı durumunu aktif/pasif olarak değiştir
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid user ID format" });
    return;
  }

  const user = await getUserOrFail(id, res);
  if (!user) return;

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User successfully ${user.isActive ? "activated" : "blocked"}`,
    userId: String(user._id),
    isActive: user.isActive,
  });
});

// ✅ Kullanıcının rolünü güncelle
export const updateUserRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { role } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid user ID format" });
    return;
  }

  if (!isValidRole(role)) {
    res.status(400).json({ message: "Invalid role" });
    return;
  }

  const user = await User.findByIdAndUpdate(
    id.trim(),
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Role updated successfully",
    user,
  });
});
