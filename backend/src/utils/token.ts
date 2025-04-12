import jwt from "jsonwebtoken";

/**
 * Generate JWT Token
 */
export const generateToken = ({ id, role }: { id: string; role: string }): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
