import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Payment from "../models/payment.models";
import { Types } from "mongoose";

// 💳 Create a new payment
export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const { order, amount, method } = req.body;

  if (!order || !amount || !method) {
    res.status(400).json({ message: "Order, amount and method are required." });
    return;
  }

  const payment = await Payment.create({
    order,
    amount,
    method,
    status: "pending",
  });

  res.status(201).json({ message: "Payment created", payment });
});

// 📋 Get all payments (admin)
export const getAllPayments = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await Payment.find().populate("order").sort({ createdAt: -1 });
  res.json(payments);
});

// 🔍 Get payment by order ID
export const getPaymentByOrderId = asyncHandler(async (req: Request, res: Response) => {
  const payment = await Payment.findOne({ order: req.params.orderId }).populate("order");
  if (!payment) {
    res.status(404).json({ message: "Payment not found for this order." });
    return;
  }
  res.json(payment);
});

// ✅ Mark as paid
export const markPaymentAsPaid = asyncHandler(async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404).json({ message: "Payment not found" });
    return;
  }

  payment.status = "paid";
  payment.paidAt = new Date();
  await payment.save();

  res.json({ message: "Payment marked as paid", payment });
});

// ❌ Mark as failed
export const markPaymentAsFailed = asyncHandler(async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404).json({ message: "Payment not found" });
    return;
  }

  payment.status = "failed";
  await payment.save();

  res.json({ message: "Payment marked as failed", payment });
});

// 🔁 Update payment method
export const updatePaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id);
  const { method } = req.body;

  if (!payment) {
    res.status(404).json({ message: "Payment not found" });
    return;
  }

  if (!["cash_on_delivery", "credit_card", "paypal"].includes(method)) {
    res.status(400).json({ message: "Invalid payment method" });
    return;
  }

  payment.method = method;
  await payment.save();

  res.json({ message: "Payment method updated", payment });
});

// 👤 Get payments for a specific user
export const getPaymentsByUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId || !Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  const payments = await Payment.find({}).populate({
    path: "order",
    match: { user: userId },
  });

  const filtered = payments.filter(p => p.order !== null);
  res.json(filtered);
});

// 🧪 Simulate Stripe payment
export const simulateStripePayment = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ message: "Stripe payment processed (simulated)" });
});

// 🧪 Simulate PayPal payment
export const simulatePayPalPayment = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ message: "PayPal payment processed (simulated)" });
});
