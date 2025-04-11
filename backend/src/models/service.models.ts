import { Schema, model, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  price: number;
  images: string[];
  durationMinutes: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, default: 60 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IService>("Service", serviceSchema);
