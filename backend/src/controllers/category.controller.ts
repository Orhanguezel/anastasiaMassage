// src/controllers/category.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Category from "../models/category.models";
import slugify from "slugify";

// ➕ Create new category
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ message: "Category name is required." });
    return;
  }

  const slug = slugify(name, { lower: true });

  const existing = await Category.findOne({ slug });
  if (existing) {
    res.status(400).json({ message: "Category already exists." });
    return;
  }

  const category = await Category.create({
    name,
    slug,
    description,
  });

  res.status(201).json({ message: "Category created", category });
});

// 📄 Get all categories (optionally isActive=true)
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = req.query;

  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const categories = await Category.find(filter).sort({ name: 1 });
  res.json(categories);
});

// 🔍 Get category by ID
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404).json({ message: "Category not found" });
    return;
  }
  res.json(category);
});

// ✏️ Update category
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, isActive } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  category.name = name ?? category.name;
  category.description = description ?? category.description;
  category.isActive = typeof isActive === "boolean" ? isActive : category.isActive;

  if (name) {
    category.slug = slugify(name, { lower: true });
  }

  await category.save();
  res.json({ message: "Category updated", category });
});

// 🗑️ Delete category
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404).json({ message: "Category not found" });
    return;
  }

  res.json({ message: "Category deleted" });
});
