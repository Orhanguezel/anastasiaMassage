import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

/**
 * Kullanıcıya JWT token üretir
 */
export const generateToken = ({ id, role }: { id: string; role: string }): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};


