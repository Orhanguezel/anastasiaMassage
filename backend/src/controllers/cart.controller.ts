import { type Request, type Response } from "express";
import Cart from "../models/cart.models";
import Product from "../models/product.models";
import Stock, { type IStock } from "../models/stock.models";
import type { IProduct } from "../models/product.models";
import { Types } from "mongoose";

export const getUserCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return void res.status(400).json({ message: "User ID is required" });

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
      res.status(201).json(cart);
      return;
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.priceAtAddition, 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : "Internal server error" });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return void res.status(400).json({ message: "User ID, Product ID and valid quantity required" });
    }

    const product = await Product.findById(productId).populate("stockRef");
    if (!product) return void res.status(404).json({ message: "Product not found" });

    const availableStock = (product.stockRef as IStock)?.quantity ?? 0;
    if (availableStock < quantity) {
      return void res.status(400).json({ message: `Only ${availableStock} items available in stock` });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        priceAtAddition: product.price,
      });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.priceAtAddition, 0);
    await cart.save();
    res.status(201).json({ message: "Product added", cart });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err });
  }
};

export const increaseQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId || !productId)
      return void res.status(400).json({ message: "User ID and Product ID are required" });

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return void res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => {
      const product = item.product as IProduct;
      return product && (product._id as Types.ObjectId).equals(new Types.ObjectId(productId));
    });

    if (itemIndex === -1)
      return void res.status(404).json({ message: "Item not found in cart" });

    const product = await Product.findById(productId).populate("stockRef");
    const stock = (product?.stockRef as IStock)?.quantity ?? 0;
    if (cart.items[itemIndex].quantity >= stock)
      return void res.status(400).json({ message: "Cannot exceed available stock" });

    cart.items[itemIndex].quantity += 1;
    cart.items[itemIndex].priceAtAddition = product?.price ?? cart.items[itemIndex].priceAtAddition;

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.priceAtAddition, 0);
    await cart.save();

    res.json({ message: "Quantity increased", cart });
  } catch (err) {
    res.status(500).json({ message: "Error increasing quantity", err });
  }
};

export const decreaseQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId || !productId) return void res.status(400).json({ message: "Missing user or product ID" });

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return void res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => {
      const product = item.product as IProduct;
      return product && (product._id as Types.ObjectId).equals(new Types.ObjectId(productId));
    });

    if (itemIndex === -1) return void res.status(404).json({ message: "Item not found" });

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.priceAtAddition, 0);
    await cart.save();

    res.json({ message: "Quantity decreased", cart });
  } catch (err) {
    res.status(500).json({ message: "Error decreasing quantity", err });
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId || !productId)
      return void res.status(400).json({ message: "User ID and Product ID are required" });

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return void res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => {
      const product = item.product as IProduct;
      return product && (product._id as Types.ObjectId).equals(new Types.ObjectId(productId));
    });

    if (itemIndex === -1)
      return void res.status(404).json({ message: "Item not found in cart" });

    cart.items.splice(itemIndex, 1);

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.priceAtAddition, 0);
    await cart.save();

    res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing item", err });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return void res.status(400).json({ message: "User ID is required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return void res.status(404).json({ message: "Cart not found" });
    if (cart.items.length === 0) return void res.status(400).json({ message: "Cart is already empty" });

    cart.items.splice(0, cart.items.length);
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart", err });
  }
};