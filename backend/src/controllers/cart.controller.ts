import { Request, Response } from "express";
import { Types } from "mongoose";
import Cart, { ICartItem } from "../models/cart.models";
import Product from "../models/product.models";
import Stock, { IStock } from "../models/stock.models";
import { IProduct } from "../models/product.models";

// 🧩 Yardımcı: Toplam fiyatı yeniden hesapla
const recalculateTotal = (items: ICartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity * item.priceAtAddition, 0);

// 🧩 Yardımcı: Ürün ve stok getir
const getProductWithStock = async (productId: string): Promise<IProduct | null> => {
  return Product.findById(productId).populate("stockRef");
};

// 🧩 Yardımcı: Sepeti getir
const getCartForUser = async (userId: string, populate = false) => {
  return populate
    ? Cart.findOne({ user: userId }).populate("items.product")
    : Cart.findOne({ user: userId });
};

// ✅ Sepeti getir
export const getUserCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  let cart = await getCartForUser(userId, true);
  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    await cart.save();
    res.status(201).json(cart);
    return;
  }

  cart.totalPrice = recalculateTotal(cart.items);
  await cart.save();
  res.status(200).json(cart);
};

// ✅ Sepete ürün ekle
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;

  if (!userId || !productId || quantity <= 0) {
    res.status(400).json({ message: "Invalid product or quantity" });
    return;
  }

  const product = await getProductWithStock(productId);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const stock = (product.stockRef as IStock)?.quantity ?? 0;
  if (stock < quantity) {
    res.status(400).json({ message: `Only ${stock} items in stock` });
    return;
  }

  let cart = await getCartForUser(userId);
  if (!cart) cart = new Cart({ user: userId, items: [], totalPrice: 0 });

  const index = cart.items.findIndex(i => i.product.toString() === productId);
  if (index > -1) {
    cart.items[index].quantity += quantity;
    cart.items[index].totalPriceAtAddition = cart.items[index].quantity * cart.items[index].priceAtAddition;
  } else {
    cart.items.push({
      product: new Types.ObjectId(productId),
      quantity,
      priceAtAddition: product.price,
      totalPriceAtAddition: quantity * product.price,
    });
  }

  cart.totalPrice = recalculateTotal(cart.items);
  await cart.save();
  res.status(201).json({ message: "Added to cart", cart });
};

// ✅ Ürün adedini artır
export const increaseQuantity = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { productId } = req.params;

  const cart = await getCartForUser(userId!, true);
  if (!cart) {
    res.status(404).json({ message: "Cart not found" });
    return;
  }

  const index = cart.items.findIndex(item => {
    const product = item.product;
    return (
      typeof product === "object" &&
      "_id" in product &&
      (product._id as Types.ObjectId).toString() === productId
    );
  });
  
  if (index === -1) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  const product = await getProductWithStock(productId);
  const stock = (product?.stockRef as IStock)?.quantity ?? 0;

  if (cart.items[index].quantity >= stock) {
    res.status(400).json({ message: "Stock limit reached" });
    return;
  }

  cart.items[index].quantity += 1;
  cart.items[index].priceAtAddition = product?.price ?? cart.items[index].priceAtAddition;
  cart.items[index].totalPriceAtAddition = cart.items[index].quantity * cart.items[index].priceAtAddition;

  cart.totalPrice = recalculateTotal(cart.items);
  await cart.save();

  res.status(200).json({ message: "Quantity increased", cart });
};

// ✅ Ürün adedini azalt
export const decreaseQuantity = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { productId } = req.params;

  const cart = await getCartForUser(userId!, true);
  if (!cart) {
    res.status(404).json({ message: "Cart not found" });
    return;
  }

  const index = cart.items.findIndex(item => {
    const product = item.product;
    return (
      typeof product === "object" &&
      "_id" in product &&
      (product._id as Types.ObjectId).toString() === productId
    );
  });
  
  if (index === -1) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  if (cart.items[index].quantity > 1) {
    cart.items[index].quantity -= 1;
    cart.items[index].totalPriceAtAddition = cart.items[index].quantity * cart.items[index].priceAtAddition;
  } else {
    cart.items.splice(index, 1);
  }

  cart.totalPrice = recalculateTotal(cart.items);
  await cart.save();

  res.status(200).json({ message: "Quantity decreased", cart });
};

// ✅ Ürünü sepetten çıkar
export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { productId } = req.params;

  const cart = await getCartForUser(userId!, true);
  if (!cart) {
    res.status(404).json({ message: "Cart not found" });
    return;
  }

  const index = cart.items.findIndex(item => {
    const product = item.product;
    return (
      typeof product === "object" &&
      "_id" in product &&
      (product._id as Types.ObjectId).toString() === productId
    );
  });
  
  if (index === -1) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  cart.items.splice(index, 1);
  cart.totalPrice = recalculateTotal(cart.items);
  await cart.save();

  res.status(200).json({ message: "Item removed", cart });
};

// ✅ Sepeti temizle
export const clearCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  const cart = await getCartForUser(userId!);
  if (!cart) {
    res.status(404).json({ message: "Cart not found" });
    return;
  }

  if (cart.items.length === 0) {
    res.status(400).json({ message: "Cart is already empty" });
    return;
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({ message: "Cart cleared", cart });
};
