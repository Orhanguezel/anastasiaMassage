import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Coupon, { ICoupon } from "../models/coupon.models";
import { isValidObjectId } from "../utils/validation";

// 🎟️ Yeni kupon oluştur
export const createCoupon = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { code, discount, expiresAt }: Partial<ICoupon> = req.body;

  if (!code || !discount || !expiresAt) {
    res.status(400).json({ message: "Code, discount and expiration date are required" });
    return;
  }

  const exists = await Coupon.findOne({ code: code.toUpperCase() });
  if (exists) {
    res.status(400).json({ message: "Coupon code already exists" });
    return;
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase().trim(),
    discount,
    expiresAt,
  });

  res.status(201).json({ message: "Coupon created successfully", coupon });
});

// 🧾 Tüm kuponları getir
export const getAllCoupons = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json(coupons);
});

// 🔍 Kuponu kod ile getir
export const getCouponByCode = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon || !coupon.isActive) {
    res.status(404).json({ message: "Coupon not found or inactive" });
    return;
  }

  res.status(200).json(coupon);
});

// ✏️ Kuponu güncelle (admin only)
export const updateCoupon = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid coupon ID" });
    return;
  }

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    res.status(404).json({ message: "Coupon not found" });
    return;
  }

  const { code, discount, expiresAt, isActive }: Partial<ICoupon> = req.body;

  if (code) coupon.code = code.toUpperCase().trim();
  if (discount) coupon.discount = discount;
  if (expiresAt) coupon.expiresAt = new Date(expiresAt);
  if (typeof isActive === "boolean") coupon.isActive = isActive;

  await coupon.save();
  res.status(200).json({ message: "Coupon updated", coupon });
});

// 🗑️ Kupon sil
export const deleteCoupon = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid coupon ID" });
    return;
  }

  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    res.status(404).json({ message: "Coupon not found or already deleted" });
    return;
  }

  res.status(200).json({ message: "Coupon deleted successfully" });
});
