// src/controllers/dashboard.controller.ts

import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import User from "../models/user.models";
import Appointment from "../models/appointment.models";
import Order from "../models/order.models";
import Product from "../models/product.models";

export const getDashboardStats = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const [totalUsers, totalAppointments, totalOrders] = await Promise.all([
      User.countDocuments(),
      Appointment.countDocuments(),
      Order.countDocuments(),
    ]);

    const totalRevenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          name: "$productDetails.name",
          totalSold: 1,
        },
      },
    ]);

    const [recentUsers, recentOrders] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt"),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("totalPrice createdAt"),
    ]);

    res.status(200).json({
      totalUsers,
      totalAppointments,
      totalOrders,
      totalRevenue,
      topProducts,
      recentUsers,
      recentOrders,
    });
  }
);
