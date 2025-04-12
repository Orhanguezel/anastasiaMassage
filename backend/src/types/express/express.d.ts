// src/types/express/index.d.ts

export interface UserPayload {
  id: string;
  _id: string;
  role: "admin" | "user" | "customer" | "moderator" | "staff";
  email?: string;
  name?: string;
  isActive?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      uploadType?: "profile" | "product" | "category" | "blog" | "gallery" | "service" | "default";
    }
  }
}

export {};
