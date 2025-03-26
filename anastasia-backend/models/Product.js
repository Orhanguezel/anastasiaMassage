import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  image: { type: String, default: "https://via.placeholder.com/150" },
  tags: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
