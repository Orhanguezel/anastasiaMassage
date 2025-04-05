import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Coupon from "../models/coupon.models";

// 🎟️ Create new coupon
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, discount, expiresAt } = req.body;

  if (!code || !discount || !expiresAt) {
    res.status(400).json({ message: "Code, discount and expiration date are required" });
    return;
  }

  const exists = await Coupon.findOne({ code });
  if (exists) {
    res.status(400).json({ message: "Coupon code already exists" });
    return;
  }

  const coupon = await Coupon.create({
    code,
    discount,
    expiresAt,
  });

  res.status(201).json({ message: "Coupon created", coupon });
});

// 🧾 Get all coupons
export const getAllCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

// 🔍 Get coupon by code
export const getCouponByCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  const coupon = await Coupon.findOne({ code });

  if (!coupon || !coupon.isActive) {
    res.status(404).json({ message: "Coupon not found or inactive" });
    return;
  }

  res.json(coupon);
});

// ✏️ Update coupon (admin only)
export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404).json({ message: "Coupon not found" });
    return;
  }

  const { code, discount, expiresAt, isActive } = req.body;
  coupon.code = code ?? coupon.code;
  coupon.discount = discount ?? coupon.discount;
  coupon.expiresAt = expiresAt ?? coupon.expiresAt;
  coupon.isActive = typeof isActive === "boolean" ? isActive : coupon.isActive;

  await coupon.save();
  res.json({ message: "Coupon updated", coupon });
});

// 🗑️ Delete coupon
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    res.status(404).json({ message: "Coupon not found or already deleted" });
    return;
  }

  res.json({ message: "Coupon deleted" });
});
