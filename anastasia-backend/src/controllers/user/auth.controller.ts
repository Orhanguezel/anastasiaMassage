import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../../models/user.models";
import { generateToken } from "../../utils/token";
import { hashPassword, comparePasswords } from "../../utils/authUtils";

const BASE_URL = process.env.BASE_URL;

// Utility: Set Token as Cookie
const setTokenCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
  });
};

// ✅ Register User
export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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

    let parsedAddresses = [],
      parsedSocialMedia = {},
      parsedNotifications = {};

    try {
      parsedAddresses =
        typeof addresses === "string" ? JSON.parse(addresses) : addresses;
      parsedSocialMedia =
        typeof socialMedia === "string" ? JSON.parse(socialMedia) : socialMedia;
      parsedNotifications =
        typeof notifications === "string"
          ? JSON.parse(notifications)
          : notifications;
    } catch (error) {
      res.status(400).json({ message: "Invalid JSON format" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    const profileImage = req.file
      ? `${BASE_URL}/uploads/profile-images/${req.file.filename}`
      : "https://via.placeholder.com/150";

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
      phone,
      addresses: parsedAddresses,
      profileImage,
      bio,
      birthDate,
      socialMedia: parsedSocialMedia,
      notifications: parsedNotifications,
    });

    const token = generateToken({ id: String(user._id), role: user.role });
    setTokenCookie(res, token); // 🍪

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
  }
);

// ✅ Login User
export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const token = generateToken({ id: String(user._id), role: user.role });
    setTokenCookie(res, token); // 🍪

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
  }
);

// ✅ Change Password
export const changePassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!.id).select("+password");
    if (!user || !(await comparePasswords(currentPassword, user.password))) {
      res.status(401).json({ message: "Invalid current password" });
      return;
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  }
);
// ✅ Logout User
export const logoutUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
);


