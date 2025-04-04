// src/middleware/uploadMiddleware.ts

import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

const BASE_UPLOAD_DIR = "uploads";
const BASE_URL = process.env.BASE_URL || "http://localhost:5011";

const UPLOAD_FOLDERS = {
  profile: "profile-images",
  product: "product-images",
  category: "category-images",
  blog: "blog-images",
  default: "",
} as const;

type UploadFolderKeys = keyof typeof UPLOAD_FOLDERS;

declare global {
  namespace Express {
    interface Request {
      uploadType?: UploadFolderKeys;
    }
  }
}


Object.values(UPLOAD_FOLDERS).forEach((folder) => {
  const fullPath = path.join(BASE_UPLOAD_DIR, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});


const storage = multer.diskStorage({
  destination: (
    req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadFolder =
      req.uploadType && UPLOAD_FOLDERS[req.uploadType]
        ? UPLOAD_FOLDERS[req.uploadType]
        : UPLOAD_FOLDERS.default;

    const fullPath = path.join(BASE_UPLOAD_DIR, uploadFolder);
    cb(null, fullPath);
  },

  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});


const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png, .gif, and .webp formats are allowed!"));
  }
};


const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});


export const serveUploads = express.static(BASE_UPLOAD_DIR);


export { BASE_URL };
export default upload;
