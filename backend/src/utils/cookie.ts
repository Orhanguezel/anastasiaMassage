import { Response } from "express";

// Set token as httpOnly cookie
export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
  });
};

// Clear token cookie
export const clearTokenCookie = (res: Response): void => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};
