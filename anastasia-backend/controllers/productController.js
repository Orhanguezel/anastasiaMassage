import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// ✅ Ürün Oluştur
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, tags = [] } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "Zorunlu alanlar eksik!" });
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

  res.status(201).json({ message: "✅ Ürün başarıyla eklendi", product });
});

// ✅ Tüm Ürünleri Getir
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(products);
});

// ✅ Tek Ürünü Getir
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı." });
  }
  res.json(product);
});

// ✅ Ürünü Güncelle
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, tags } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı." });
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
  res.json({ message: "✅ Ürün güncellendi", product });
});

// ✅ Ürünü Sil
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Ürün bulunamadı." });
  }
  res.json({ message: "🗑️ Ürün silindi." });
});
