// src/models/coupon.models.ts
import { Schema, model, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discount: number;
  isActive: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // Örn: 10 = %10 indirim
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model<ICoupon>("Coupon", couponSchema);

