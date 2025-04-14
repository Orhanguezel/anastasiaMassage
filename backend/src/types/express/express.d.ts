// src/types/express/index.d.ts

export interface UserPayload {
  id: string;
  _id?: string; // Opsiyonel çünkü genelde sadece `id` taşınır
  role: "admin" | "user" | "customer" | "moderator" | "staff";
  email?: string;
  name?: string;
  isActive?: boolean;
  iat?: number; // JWT: issued at
  exp?: number; // JWT: expiration
}

// 🌐 Global tanım
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      uploadType?: "profile" | "product" | "category" | "blog" | "gallery" | "service" | "default";
    }
  }

  // 🌐 Global olarak her yerde kullanılabilecek JWT içeriği
  interface IUserToken extends UserPayload {}
}

export {};
