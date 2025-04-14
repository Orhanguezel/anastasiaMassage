import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Service from "../models/service.models";

// 🆕 Create Service
export const createService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    title,
    shortDescription,
    detailedDescription,
    price,
    durationMinutes,
  } = req.body;

  if (!title || !price || !durationMinutes) {
    res.status(400).json({ message: "Title, price and duration are required." });
    return;
  }

  const images = req.files
    ? (req.files as Express.Multer.File[]).map(
        (file) => `${process.env.BASE_URL}/uploads/service-images/${file.filename}`
      )
    : [];

  const service = await Service.create({
    title,
    shortDescription,
    detailedDescription,
    price,
    durationMinutes,
    images,
  });

  res.status(201).json({ message: "Service created successfully", service });
});

// 📋 Get All Services
export const getAllServices = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.status(200).json(services);
});

// 🔍 Get Service by ID
export const getServiceById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404).json({ message: "Service not found" });
    return;
  }
  res.status(200).json(service);
});

// ✏️ Update Service
export const updateService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404).json({ message: "Service not found" });
    return;
  }

  const {
    title,
    shortDescription,
    detailedDescription,
    price,
    durationMinutes,
    isActive,
  } = req.body;

  service.title = title ?? service.title;
  service.shortDescription = shortDescription ?? service.shortDescription;
  service.detailedDescription = detailedDescription ?? service.detailedDescription;
  service.price = price ?? service.price;
  service.durationMinutes = durationMinutes ?? service.durationMinutes;
  service.isActive = typeof isActive === "boolean" ? isActive : service.isActive;

  // 📷 Yeni resimler eklendiğinde birleştir
  if (req.files && Array.isArray(req.files)) {
    const newImages = (req.files as Express.Multer.File[]).map(
      (file) => `${process.env.BASE_URL}/uploads/service-images/${file.filename}`
    );
    service.images = [...service.images, ...newImages];
  }

  await service.save();
  res.status(200).json({ message: "Service updated", service });
});

// ❌ Delete Service
export const deleteService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404).json({ message: "Service not found" });
    return;
  }

  res.status(200).json({ message: "Service deleted successfully" });
});
