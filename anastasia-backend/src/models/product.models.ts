import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  tags?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    image: { type: String, default: "https://via.placeholder.com/150" },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
export default Product;
