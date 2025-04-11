// src/controllers/order.controller.ts
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/order.models";
import Product from "../models/product.models";
import Stock from "../models/stock.models";
import { sendEmail } from "../services/emailService";
import User from "../models/user.models";
import { IOrderItem } from "../models/order.models";
import { orderConfirmationTemplate } from "../templates/orderConfirmation";
import Notification from "../models/notification.models";

export const createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { items, shippingAddress, totalPrice }: {
    items: IOrderItem[];
    shippingAddress: any;
    totalPrice: number;
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400).json({ message: "Cart must not be empty." });
    return;
  }

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.stockRef) {
      res.status(404).json({ message: `Product or stock not found for ID ${item.product}` });
      return;
    }

    const stock = await Stock.findById(product.stockRef);
    if (!stock || stock.quantity < item.quantity) {
      res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      return;
    }

    stock.quantity -= item.quantity;
    await stock.save();
  }

  const order = await Order.create({
    user: req.user?._id || null,
    items,
    shippingAddress,
    totalPrice,
    paymentMethod: "cash_on_delivery",
  });

  const itemsList = items
    .map((item: IOrderItem) => `• Produkt ID: ${item.product} - Menge: ${item.quantity}`)
    .join("<br/>");

  const user = req.user ? await User.findById(req.user._id).select("email") : null;
  const customerEmail = shippingAddress?.email || user?.email || "";

  const htmlToCustomer = orderConfirmationTemplate({
    name: shippingAddress.name,
    itemsList,
    totalPrice,
  });

  const htmlToAdmin = `
    <h2>Neue Bestellung</h2>
    <p>Ein Kunde hat eine neue Bestellung aufgegeben:</p>
    <p><strong>Gesamtpreis:</strong> €${totalPrice.toFixed(2)}</p>
    <p><strong>Produkte:</strong><br/>${itemsList}</p>
    <p><strong>Lieferadresse:</strong><br/>
      ${shippingAddress.name},<br/>
      ${shippingAddress.street},<br/>
      ${shippingAddress.postalCode} ${shippingAddress.city},<br/>
      ${shippingAddress.country}
    </p>
  `;

  await sendEmail({
    to: customerEmail,
    subject: "Bestellbestätigung – Anastasia Massage",
    html: htmlToCustomer,
  });

  await sendEmail({
    to: process.env.SMTP_FROM || "admin@example.com",
    subject: "Neue Bestellung – Anastasia Massage",
    html: htmlToAdmin,
  });

  res.status(201).json({
    message: "Order created successfully.",
    order,
  });
  

  await Notification.create({
    title: "Neue Bestellung erhalten",
    message: `Ein Kunde hat eine neue Bestellung aufgegeben. Gesamtpreis: €${totalPrice.toFixed(2)}`,
    type: "success",
    user: null,
  });

});



// ✅ Get All Orders (Admin)
export const getAllOrders = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(orders);
  console.log("🟢 Orders response:", orders[0]);

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

// ✅ Update Order Status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404).json({ message: "Order not found",order });
    return;
  }

  order.set({ ...req.body });
  await order.save();

  res.json({ success: true, message: "Order status updated", order });
});

