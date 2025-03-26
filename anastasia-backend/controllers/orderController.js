import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";

// ✅ Sipariş Oluştur (Kapıda Ödeme)
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Sepet boş olamaz." });
  }

  const order = await Order.create({
    user: req.user?._id || null, // üye olmayabilir
    items,
    shippingAddress,
    totalPrice,
    paymentMethod: "cash_on_delivery",
  });

  res.status(201).json({
    message: "✅ Sipariş başarıyla oluşturuldu.",
    order,
  });
});

// ✅ Tüm Siparişleri Listele (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.status(200).json(orders);
});

// ✅ Sipariş Teslim Durumu Güncelle
export const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Sipariş bulunamadı." });
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();
  await order.save();

  res.json({ message: "✅ Sipariş teslim edildi olarak işaretlendi." });
});
