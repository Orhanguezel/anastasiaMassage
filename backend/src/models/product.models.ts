// src/models/product.models.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IStock } from "./stock.models";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stockRef?: Types.ObjectId | (IStock & Document);
  category: Types.ObjectId; // referans
  image: string;
  tags?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    stockRef: { type: Schema.Types.ObjectId, ref: "Stock" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    image: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
export default Product;
