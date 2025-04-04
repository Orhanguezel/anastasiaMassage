// src/controllers/product.controller.ts

import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Product from "../models/product.models";
import { BASE_URL } from "../middleware/uploadMiddleware";

// ✅ Create Product
export const createProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, stock, category, tags = [] } = req.body;

    if (!name || !price || !category) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const image = req.file
      ? `${process.env.BASE_URL}/uploads/product-images/${req.file.filename}`
      : "https://via.placeholder.com/150";

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image,
      tags,
    });

    res.status(201).json({ message: "Product created successfully", product });
  }
);

// ✅ Get All Products
export const getAllProducts = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  }
);

// ✅ Get Product by ID
export const getProductById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  }
);

// ✅ Update Product
export const updateProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, stock, category, tags } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock ?? product.stock;
    product.category = category || product.category;
    product.tags = tags || product.tags;

    if (req.file) {
      product.image = `${process.env.BASE_URL}/uploads/product-images/${req.file.filename}`;
    }

    await product.save();
    res.json({ message: "Product updated successfully", product });
  }
);

// ✅ Delete Product
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json({ message: "Product deleted successfully" });
  }
);
