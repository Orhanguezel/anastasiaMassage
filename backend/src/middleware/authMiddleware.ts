// src/middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.models";

// 🔐 Kullanıcıyı doğrulayan middleware
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let token: string | undefined;

      // 1. Authorization header'dan al
      if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      // 2. Cookie'den al
      if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }

      // 3. Token yoksa hata
      if (!token) {
        res.status(401).json({ success: false, message: "Authorization token missing" });
        return;
      }

      // 4. Token çözümle
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      if (!decoded?.id) {
        res.status(401).json({ success: false, message: "Invalid token payload" });
        return;
      }

      // 5. Kullanıcıyı veritabanından al
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401).json({ success: false, message: "User not found" });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ success: false, message: "Account is deactivated" });
        return;
      }

      // 6. req.user objesini ayarla (controller'da kullanılsın)
      req.user = {
        id: user.id.toString(),         // JWT içindeki ID
        _id: user.id.toString(),        // Mongoose işlemleri için
        role: user.role,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
      };

      next();

    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ success: false, message: "Token expired" });
        return;
      }

      res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  }
);

// 🔐 Rol bazlı yetki kontrolü
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(", ")}`,
      });
      return;
    }

    next();
  };
};
