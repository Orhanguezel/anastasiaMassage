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
  gallery: "gallery",
  service: "service-images",
  default: "",
} as const;

type UploadFolderKeys = keyof typeof UPLOAD_FOLDERS;

// TypeScript için request'e uploadType ekliyoruz
declare global {
  namespace Express {
    interface Request {
      uploadType?: UploadFolderKeys;
    }
  }
}

// 📁 Gerekli klasörleri oluştur
Object.values(UPLOAD_FOLDERS).forEach((folder) => {
  const fullPath = path.join(BASE_UPLOAD_DIR, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// 📂 Dosya depolama ayarı
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const uploadFolder =
      req.uploadType && UPLOAD_FOLDERS[req.uploadType]
        ? UPLOAD_FOLDERS[req.uploadType]
        : UPLOAD_FOLDERS.default;

    const fullPath = path.join(BASE_UPLOAD_DIR, uploadFolder);
    cb(null, fullPath);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true); // ✅ Geçerli dosya
  } else {
    console.warn(`❌ Unsupported file: ${file.originalname}`);
    cb(null, false); // ✅ Hata fırlatmadan sadece yüklemeyi engelle
  }
};


// 🎯 Multer yapılandırması
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, 
  fileFilter,
});

// 🌐 uploads klasörünü statik olarak sun
export const serveUploads = express.static(BASE_UPLOAD_DIR);
export { BASE_URL };
export default upload;
