// src/types/express/index.d.ts

import type { IUser } from "../../models/user.models";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      uploadType?: "profile" | "product" | "category" | "blog" | "gallery"| "service" |"default";
    }
  }
}


  
  
