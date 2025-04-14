import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Product from "../models/product.models";
import { BASE_URL } from "../middleware/uploadMiddleware";

// 🔹 Create Product
export const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, category, tags = [], stockRef } = req.body;

  if (!name || !price || !category) {
    res.status(400).json({ message: "Missing required fields: name, price or category." });
    return;
  }

  const image = req.file
    ? `${BASE_URL}/uploads/product-images/${req.file.filename}`
    : "https://via.placeholder.com/150";

  const product = await Product.create({
    name,
    description,
    price,
    category,
    image,
    tags,
    stockRef,
  });

  res.status(201).json({ message: "Product created successfully", product });
});

// 🔹 Get All Products with Filters + category populate
export const getAllProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { category, isActive, tags, name } = req.query;
  const filter: any = {};

  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (tags) {
    const tagsArray = (tags as string).split(",").map(tag => tag.trim());
    filter.tags = { $in: tagsArray };
  }
  if (name) {
    filter.name = { $regex: new RegExp(name as string, "i") };
  }

  const products = await Product.find(filter)
    .populate("stockRef")
    .populate("category") // <--- burası eklendi
    .sort({ createdAt: -1 });

  res.status(200).json(products);
});

// 🔹 Get Single Product by ID + category populate
export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.id)
    .populate("stockRef")
    .populate("category"); // <--- burası eklendi

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.status(200).json(product);
});

// 🔹 Update Product
export const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, category, tags, stockRef } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.tags = tags ?? product.tags;
  product.stockRef = stockRef ?? product.stockRef;

  if (req.file) {
    product.image = `${BASE_URL}/uploads/product-images/${req.file.filename}`;
  }

  await product.save();
  res.status(200).json({ message: "Product updated successfully", product });
});

// 🔹 Delete Product
export const deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404).json({ message: "Product not found or already deleted" });
    return;
  }

  res.status(200).json({ message: "Product deleted successfully" });
});
