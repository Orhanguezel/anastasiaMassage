import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Feedback from "../models/feedback.models";
import { isValidObjectId } from "../utils/validation";

// 💬 Yeni geri bildirim oluştur (herkes)
export const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, message, rating } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ message: "Lütfen tüm gerekli alanları doldurun." });
    return;
  }

  const feedback = await Feedback.create({ name, email, message, rating });
  res.status(201).json({ message: "Geri bildirim gönderildi", feedback });
});

// 🔐 Tüm geri bildirimleri getir (admin)
export const getAllFeedbacks = asyncHandler(async (_req: Request, res: Response) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.status(200).json(feedbacks);
});

// 🔁 Yayın durumunu değiştir (admin)
export const togglePublishFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Geçersiz ID" });
    return;
  }

  const feedback = await Feedback.findById(id);
  if (!feedback) {
    res.status(404).json({ message: "Geri bildirim bulunamadı" });
    return;
  }

  feedback.isPublished = !feedback.isPublished;
  await feedback.save();

  res.status(200).json({
    message: `Geri bildirim ${feedback.isPublished ? "yayınlandı" : "yayından kaldırıldı"}`,
    feedback,
  });
});

// ❌ Geri bildirimi sil (admin)
export const deleteFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Geçersiz ID" });
    return;
  }

  const feedback = await Feedback.findByIdAndDelete(id);
  if (!feedback) {
    res.status(404).json({ message: "Geri bildirim bulunamadı" });
    return;
  }

  res.status(200).json({ message: "Geri bildirim silindi." });
});
