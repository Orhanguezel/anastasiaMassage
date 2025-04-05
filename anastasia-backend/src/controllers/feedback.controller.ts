import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Feedback from "../models/feedback.models";

// Create Feedback
export const createFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, message, rating } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ message: "Please fill in all required fields." });
    return;
  }

  const feedback = await Feedback.create({ name, email, message, rating });
  res.status(201).json({ message: "Feedback submitted", feedback });
});

// Get All Feedbacks (admin only)
export const getAllFeedbacks = asyncHandler(async (_req: Request, res: Response) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedbacks);
});

// Publish or Unpublish
export const togglePublishFeedback = asyncHandler(async (req: Request, res: Response) => {
  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    res.status(404).json({ message: "Feedback not found" });
    return;
  }

  feedback.isPublished = !feedback.isPublished;
  await feedback.save();

  res.json({ message: "Feedback publish status updated", feedback });
});

// Delete Feedback
export const deleteFeedback = asyncHandler(async (req: Request, res: Response) => {
  const feedback = await Feedback.findByIdAndDelete(req.params.id);
  if (!feedback) {
    res.status(404).json({ message: "Feedback not found" });
    return;
  }

  res.json({ message: "Feedback deleted successfully" });
});
