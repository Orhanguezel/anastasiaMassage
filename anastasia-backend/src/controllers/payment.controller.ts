import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Payment from "../models/payment.models";

// Create Payment
export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const { order, amount, method } = req.body;

  if (!order || !amount || !method) {
    res.status(400).json({ message: "Missing payment data" });
    return;
  }

  const payment = await Payment.create({
    order,
    amount,
    method,
    status: "pending",
  });

  res.status(201).json({ message: "Payment record created", payment });
});

// Get All Payments
export const getAllPayments = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await Payment.find().populate("order").sort({ createdAt: -1 });
  res.json(payments);
});

// Get Payment by Order ID
export const getPaymentByOrderId = asyncHandler(async (req: Request, res: Response) => {
  const payment = await Payment.findOne({ order: req.params.orderId }).populate("order");
  if (!payment) {
    res.status(404).json({ message: "Payment not found" });
    return;
  }
  res.json(payment);
});

// Mark Payment as Paid
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
