// src/models/coupon.models.ts
import { Schema, model, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discount: number; // e.g. 10 = %10
  isActive: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value > new Date(),
        message: "Expiration date must be in the future.",
      },
    },
  },
  { timestamps: true }
);

const Coupon: Model<ICoupon> = model<ICoupon>("Coupon", couponSchema);
export default Coupon;
