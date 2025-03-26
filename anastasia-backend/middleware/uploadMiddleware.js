import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// 📌 **Ana Upload Klasörü**
const BASE_UPLOAD_DIR = "uploads";

// 📌 **Geçerli Klasörler (Profil, Ürün, Kategori vb.)**
const UPLOAD_FOLDERS = {
  profile: "profile-images",
  product: "product-images",
  category: "category-images",
  default: "", // Eğer spesifik bir klasör belirtilmezse `uploads/` içine kaydedilecek
};

// 📌 **Belirli klasörler oluşturulmazsa otomatik oluştur**
Object.values(UPLOAD_FOLDERS).forEach((folder) => {
  const fullPath = path.join(BASE_UPLOAD_DIR, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// 📌 **Multer Konfigürasyonu**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // **Klasörü belirleme (Varsayılan: uploads/)**
    let uploadPath = BASE_UPLOAD_DIR;

    if (req.uploadType && UPLOAD_FOLDERS[req.uploadType]) {
      uploadPath = path.join(BASE_UPLOAD_DIR, UPLOAD_FOLDERS[req.uploadType]);
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

// 📌 **Dosya Türü Kontrolü**
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  if (allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("⚠️ Sadece .jpeg, .jpg, .png, .gif ve .webp formatları desteklenmektedir!"), false);
  }
};

// 📌 **Multer Middleware**
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // ✅ Maksimum 20MB
  fileFilter,
});

// 📌 **Uploads Klasörünü Statik Olarak Servis Etme**
export const serveUploads = express.static(BASE_UPLOAD_DIR);

export default upload;
