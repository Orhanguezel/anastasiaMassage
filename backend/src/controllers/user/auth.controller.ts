// src/controllers/user/auth.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../../models/user.models";
import { loginAndSetToken, logoutAndClearToken, hashNewPassword, checkPassword } from "../../services/authService";
import {
  validateJsonField,
  validateEmailFormat,
  isValidRole,
} from "../../utils/validation";

const BASE_URL = process.env.BASE_URL;

// ✅ Register
export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    email,
    password,
    role = "user",
    phone,
    addresses = "[]",
    bio = "",
    birthDate,
    socialMedia = '{"facebook": "", "twitter": "", "instagram": ""}',
    notifications = '{"emailNotifications": true, "smsNotifications": false}',
  } = req.body;

  // 🔐 Email kontrolü
  if (!validateEmailFormat(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  // 🔐 Şifre kontrolü
  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }

  // 🔐 Rol kontrolü
  const normalizedRole = role.toLowerCase();
  if (!isValidRole(normalizedRole)) {
    res.status(400).json({ message: "Invalid user role" });
    return;
  }

  // ✅ JSON alanlarını parse et
  let parsedAddresses, parsedSocialMedia, parsedNotifications;
  try {
    parsedAddresses = validateJsonField(addresses, "addresses");
    parsedSocialMedia = validateJsonField(socialMedia, "socialMedia");
    parsedNotifications = validateJsonField(notifications, "notifications");
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }

  // ✅ Profil görseli
  const profileImage = req.file
    ? `${BASE_URL}/uploads/profile-images/${req.file.filename}`
    : "https://via.placeholder.com/150";

  // ✅ Şifreyi hashle
  const hashedPassword = await hashNewPassword(password);

  // ✅ Kullanıcıyı oluştur
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: normalizedRole,
    phone,
    addresses: parsedAddresses,
    profileImage,
    bio,
    birthDate,
    socialMedia: parsedSocialMedia,
    notifications: parsedNotifications,
  });

  // ✅ Token oluştur ve cookie’ye yaz
  await loginAndSetToken(res, user.id, user.role);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  });
});

// ✅ Login
export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!validateEmailFormat(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await checkPassword(password, user.password))) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  await loginAndSetToken(res, user.id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  });
});

// ✅ Change Password
export const changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user!.id).select("+password");
  if (!user || !(await checkPassword(currentPassword, user.password))) {
    res.status(401).json({ message: "Invalid current password" });
    return;
  }

  user.password = await hashNewPassword(newPassword);
  await user.save();

  res.status(200).json({ success: true, message: "Password updated successfully" });
});

// ✅ Logout
export const logoutUser = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  logoutAndClearToken(res);
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});
