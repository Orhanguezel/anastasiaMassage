import { type Request, type Response } from "express";
import Cart from "../models/cart.models";
import Product from "../models/product.models";

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

    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.priceAtAddition;
    }, 0);
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

    const product = await Product.findById(productId);
    if (!product) return void res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity) {
      return void res.status(400).json({ message: `Only ${product.stock} available in stock` });
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
      return (
        item.product &&
        typeof (item.product as any)._id !== "undefined" &&
        (item.product as any)._id.toString() === productId
      );
    });
    
    if (itemIndex === -1)
      return void res.status(404).json({ message: "Item not found in cart" });

    const product = cart.items[itemIndex].product as any;
    if (cart.items[itemIndex].quantity >= product.stock)
      return void res.status(400).json({ message: "Cannot exceed available stock" });

    cart.items[itemIndex].quantity += 1;
    cart.items[itemIndex].priceAtAddition = product.price;

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
      return (
        item.product &&
        typeof (item.product as any)._id !== "undefined" &&
        (item.product as any)._id.toString() === productId
      );
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
      return (
        item.product &&
        typeof (item.product as any)._id !== "undefined" &&
        (item.product as any)._id.toString() === productId
      );
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

