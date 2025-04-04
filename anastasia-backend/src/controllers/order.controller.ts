import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/order.models";
import { IOrder } from "../models/order.models";

// ✅ Create Order (Cash on Delivery)
export const createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { items, shippingAddress, totalPrice } = req.body;

  if (!items || items.length === 0) {
    res.status(400).json({ message: "Cart must not be empty." });
    return;
  }

  const order = await Order.create({
    user: req.user?._id || null,
    items,
    shippingAddress,
    totalPrice,
    paymentMethod: "cash_on_delivery",
  });

  res.status(201).json({
    message: "Order created successfully.",
    order,
  });
});

// ✅ Get All Orders (Admin)
export const getAllOrders = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(orders);
});

// ✅ Mark Order as Delivered
export const markOrderAsDelivered = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();
  await order.save();

  res.json({ message: "Order marked as delivered" });
});

// ✅ Update Order Status (optional, if you plan to add more statuses)
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  order.set({ ...req.body });
  await order.save();

  res.json({ success: true, message: "Order status updated", order });
});
