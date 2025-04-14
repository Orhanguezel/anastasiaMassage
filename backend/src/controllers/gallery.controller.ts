// src/controllers/gallery.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Gallery from "../models/gallery.models";

// 📤 Yeni medya yükle
export const uploadGalleryItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, type }: { title?: string; type?: "image" | "video" } = req.body;

  if (!req.file) {
    res.status(400).json({ message: "Dosya yüklenmedi." });
    return;
  }

  const imageUrl = `${process.env.BASE_URL}/uploads/gallery/${req.file.filename}`;

  const item = await Gallery.create({
    title,
    image: imageUrl,
    type: type || "image",
  });

  res.status(201).json({
    message: "Medya başarıyla yüklendi.",
    item,
  });
});

// 📥 Tüm medya öğelerini getir
export const getAllGalleryItems = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const items = await Gallery.find().sort({ createdAt: -1 });
  res.status(200).json(items);
});

// 🗑️ Medya öğesini sil
export const deleteGalleryItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404).json({ message: "Medya bulunamadı." });
    return;
  }

  res.status(200).json({ message: "Medya başarıyla silindi." });
});
