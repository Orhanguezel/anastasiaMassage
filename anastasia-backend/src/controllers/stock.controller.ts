// src/controllers/stock.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Stock from "../models/stock.models";
import Product from "../models/product.models";

// ✅ Create new stock item
export const createStock = asyncHandler(async (req: Request, res: Response) => {
  const { product, quantity, type, note } = req.body;

  if (!product || typeof quantity !== "number" || !type) {
    res.status(400).json({ message: "Product, quantity and type are required." });
    return;
  }

  const foundProduct = await Product.findById(product) as typeof Product.prototype | null;

  if (!foundProduct) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const stock = await Stock.create({ product, quantity, type, note });
  if (!stock) {
    res.status(500).json({ message: "Failed to create stock record" });
    return;
  }
  foundProduct.stockRef = stock._id;
  await foundProduct.save();

  res.status(201).json({ message: "Stock record created", stock });
});



// ✅ Get all stock records
export const getAllStocks = asyncHandler(async (_req: Request, res: Response) => {
  const stocks = await Stock.find().populate("product").sort({ createdAt: -1 });
  res.json(stocks);
});

// ✅ Delete stock record
export const deleteStock = asyncHandler(async (req: Request, res: Response) => {
  const stock = await Stock.findByIdAndDelete(req.params.id);
  if (!stock) {
    res.status(404).json({ message: "Stock record not found" });
    return;
  }
  await Product.updateOne({ stockRef: stock._id }, { $unset: { stockRef: 1 } });

  res.json({ message: "Stock record deleted" });
});

