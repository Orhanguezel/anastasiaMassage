import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Stock, { IStock } from "../models/stock.models";
import Product from "../models/product.models";
import { Types } from "mongoose";

// ✅ Create Stock
export const createStock = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { product, quantity, type, note } = req.body;

    if (
      !product ||
      !Types.ObjectId.isValid(product) ||
      typeof quantity !== "number" ||
      !["initial", "manual", "restock", "sale"].includes(type)
    ) {
      res.status(400).json({ message: "Invalid or missing fields: product, quantity, or type." });
      return;
    }

    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    const stock: IStock = await Stock.create({ product, quantity, type, note });
    if (!stock) {
      res.status(500).json({ message: "Stock creation failed." });
      return;
    }
    foundProduct.stockRef = stock._id as Types.ObjectId
    await foundProduct.save();

    res.status(201).json({
      message: "Stock record created successfully",
      stock,
    });

  } catch (error: any) {
    console.error("🛑 Error during stock creation:", error.message);

    if (error.name === "ValidationError" && error.errors) {
      const validationErrors: Record<string, string> = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
        console.error(`❌ ${field}: ${error.errors[field].message}`);
      }

      res.status(400).json({
        message: "Stock creation failed due to validation error.",
        errors: validationErrors,
      });
      return;
    }

    res.status(500).json({ message: "Internal server error during stock creation." });
  }
});



// 📦 Get All Stock Records
export const getAllStocks = asyncHandler(
  async (_req: Request, res: Response) => {
    const stocks = await Stock.find()
      .populate("product")
      .sort({ createdAt: -1 });
    res.status(200).json(stocks);
  }
);

// 🔍 Get Stock by Product ID
export const getStockByProductId = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    if (!Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: "Invalid product ID." });
      return;
    }

    const stock = await Stock.findOne({ product: productId }).populate(
      "product"
    );

    if (!stock) {
      res
        .status(404)
        .json({ message: "Stock record not found for this product." });
      return;
    }

    res.status(200).json(stock);
  }
);

// ✏️ Update Stock
export const updateStock = asyncHandler(async (req: Request, res: Response) => {
  const stock = await Stock.findById(req.params.id);
  if (!stock) {
    res.status(404).json({ message: "Stock record not found." });
    return;
  }

  const { quantity, type, note } = req.body;

  if (typeof quantity === "number") stock.quantity = quantity;
  if (type && ["initial", "manual", "restock", "sale"].includes(type))
    stock.type = type;
  if (note !== undefined) stock.note = note;

  await stock.save();
  res.status(200).json({ message: "Stock updated successfully", stock });
});

// ❌ Delete Stock
export const deleteStock = asyncHandler(async (req: Request, res: Response) => {
  const stock = await Stock.findByIdAndDelete(req.params.id);
  if (!stock) {
    res.status(404).json({ message: "Stock record not found." });
    return;
  }

  await Product.updateOne({ stockRef: stock._id }, { $unset: { stockRef: 1 } });
  res.status(200).json({ message: "Stock record deleted successfully" });
});
