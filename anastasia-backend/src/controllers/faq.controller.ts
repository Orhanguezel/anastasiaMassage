import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import FAQ from "../models/faq.models";

// ➕ Create FAQ
export const createFAQ = asyncHandler(async (req: Request, res: Response) => {
  const { question, answer, category } = req.body;

  if (!question || !answer) {
    res.status(400).json({ message: "Question and answer are required." });
    return;
  }

  const faq = await FAQ.create({ question, answer, category });
  res.status(201).json({ message: "FAQ created", faq });
});

// 📄 Get All FAQs (public)
export const getAllFAQs = asyncHandler(async (_req: Request, res: Response) => {
  const faqs = await FAQ.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(faqs);
});

// 🗑️ Delete FAQ (admin)
export const deleteFAQ = asyncHandler(async (req: Request, res: Response) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) {
    res.status(404).json({ message: "FAQ not found" });
    return;
  }
  res.json({ message: "FAQ deleted successfully" });
});
