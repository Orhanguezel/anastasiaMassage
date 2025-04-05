// src/controllers/dashboard.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.models";
import Order from "../models/order.models";
import Appointment from "../models/appointment.models";
import Product from "../models/product.models";
import Blog from "../models/blog.models";

// ✅ Get admin dashboard stats
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const [userCount, orderCount, productCount, appointmentCount, blogCount] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Appointment.countDocuments(),
    Blog.countDocuments(),
  ]);

  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  res.status(200).json({
    users: userCount,
    orders: orderCount,
    products: productCount,
    appointments: appointmentCount,
    blogs: blogCount,
    revenue: totalRevenue[0]?.total || 0,
  });
});

