import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import FAQ, { IFAQ } from "../models/faq.models";
import { isValidObjectId } from "../utils/validation";

// ➕ SSS Oluştur (admin)
export const createFAQ = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { question, answer, category }: Partial<IFAQ> = req.body;

  if (!question || !answer) {
    res.status(400).json({ message: "Question and answer are required." });
    return;
  }

  const faq = await FAQ.create({
    question: question.trim(),
    answer: answer.trim(),
    category: category?.trim(),
  });

  res.status(201).json({ message: "FAQ created successfully", faq });
});

// 📄 Tüm aktif SSS'leri getir (public)
export const getAllFAQs = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const faqs = await FAQ.find({ isActive: true }).sort({ createdAt: -1 });
  res.status(200).json(faqs);
});

// 🗑️ SSS sil (admin)
export const deleteFAQ = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid FAQ ID" });
    return;
  }

  const faq = await FAQ.findByIdAndDelete(id);
  if (!faq) {
    res.status(404).json({ message: "FAQ not found" });
    return;
  }

  res.status(200).json({ message: "FAQ deleted successfully" });
});

// 🔄 SSS Güncelle (admin)
export const updateFAQ = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { question, answer, category, isActive } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid FAQ ID" });
    return;
  }

  const faq = await FAQ.findById(id);
  if (!faq) {
    res.status(404).json({ message: "FAQ not found" });
    return;
  }

  faq.question = question?.trim() ?? faq.question;
  faq.answer = answer?.trim() ?? faq.answer;
  faq.category = category?.trim() ?? faq.category;
  if (typeof isActive === "boolean") faq.isActive = isActive;

  await faq.save();
  res.status(200).json({ message: "FAQ updated successfully", faq });
});
