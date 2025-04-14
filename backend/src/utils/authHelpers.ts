// src/utils/authHelpers.ts

import { Request } from "express";

export const getTokenFromRequest = (req: Request): string | undefined => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  return req.cookies?.accessToken;
};
