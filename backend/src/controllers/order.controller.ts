// src/controllers/order.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Order, { IOrderItem, OrderStatus } from "../models/order.models";
import Product from "../models/product.models";
import Stock from "../models/stock.models";
import User from "../models/user.models";
import Notification from "../models/notification.models";
import { sendEmail } from "../services/emailService";
import { orderConfirmationTemplate } from "../templates/orderConfirmation";

// ✅ Sipariş oluştur
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

  // 🧾 Stok kontrolü ve azaltma
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

  // 🧾 Sipariş oluştur
  const order = await Order.create({
    user: req.user?._id || null,
    items,
    shippingAddress,
    totalPrice,
    paymentMethod: "cash_on_delivery",
  });

  // 📧 Mail içerikleri
  const itemsList = items
    .map(item => `• Produkt ID: ${item.product} - Menge: ${item.quantity}`)
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

  // 📧 Mail gönderimi
  await Promise.all([
    sendEmail({
      to: customerEmail,
      subject: "Bestellbestätigung – Anastasia Massage",
      html: htmlToCustomer,
    }),
    sendEmail({
      to: process.env.SMTP_FROM || "admin@example.com",
      subject: "Neue Bestellung – Anastasia Massage",
      html: htmlToAdmin,
    }),
  ]);

  // 📣 Bildirim oluştur
  void Notification.create({
    title: "Neue Bestellung erhalten",
    message: `Ein Kunde hat eine neue Bestellung aufgegeben. Gesamtpreis: €${totalPrice.toFixed(2)}`,
    type: "success",
    user: req.user?._id || null,
  });

  res.status(201).json({
    message: "Order created successfully.",
    order,
  });
});

// ✅ Tüm siparişleri getir (Admin)
export const getAllOrders = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(orders);
});

// ✅ Siparişi teslim edildi olarak işaretle
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

// ✅ Sipariş durumunu güncelle
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body as { status: OrderStatus };
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  order.status = status;
  await order.save();

  res.json({ success: true, message: "Order status updated", order });
});
