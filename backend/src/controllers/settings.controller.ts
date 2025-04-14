import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Setting from "../models/settings.models";

// 🔄 Create or Update Setting
export const upsertSetting = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { key, value } = req.body;

  if (!key || !value) {
    res.status(400).json({ message: "Key and value are required." });
    return;
  }

  const setting = await Setting.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
  res.status(200).json({ message: "Setting saved", setting });
});

// 📄 Get All Settings
export const getAllSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const settings = await Setting.find().sort({ key: 1 });
  res.status(200).json(settings);
});

// 🔍 Get Setting by Key
export const getSettingByKey = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { key } = req.params;
  const setting = await Setting.findOne({ key });

  if (!setting) {
    res.status(404).json({ message: "Setting not found." });
    return;
  }

  res.json(setting);
});

// 🗑️ Delete Setting
export const deleteSetting = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { key } = req.params;
  const deleted = await Setting.findOneAndDelete({ key });

  if (!deleted) {
    res.status(404).json({ message: "Setting not found." });
    return;
  }

  res.json({ message: "Setting deleted", deleted });
});
