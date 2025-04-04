import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.models";
 

declare namespace Express {
  export interface Request {
    user?: IUser; 
    uploadType?: "profile" | "product" | "category" | "blog" | "default";
  }
}

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ success: false, message: "Authorization token missing" });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

      if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
        res.status(401).json({ success: false, message: "Invalid token payload" });
        return;
      }

      const user = await User.findById((decoded as { id: string }).id).select("-password");
      if (!user) {
        res.status(401).json({ success: false, message: "User not found" });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ success: false, message: "Account is deactivated" });
        return;
      }

      req.user = user; 
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
