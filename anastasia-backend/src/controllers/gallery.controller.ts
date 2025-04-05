import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Gallery from "../models/gallery.models";

// Upload new gallery image or video
export const uploadGalleryItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, type } = req.body;

  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }


  const imageUrl = req.file
  ? `${process.env.BASE_URL}/uploads/gallery/${req.file.filename}`
  : "https://via.placeholder.com/150";

  const item = await Gallery.create({
    title,
    image: imageUrl,
    type: type || "image",
  });

  res.status(201).json({
    message: "Media uploaded successfully",
    item,
  });
});

// Get all gallery items
export const getAllGalleryItems = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const items = await Gallery.find().sort({ createdAt: -1 });
  res.json(items);
});

// Delete gallery item by ID
export const deleteGalleryItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404).json({ message: "Gallery item not found" });
    return;
  }

  res.json({ message: "Gallery item deleted successfully" });
});
