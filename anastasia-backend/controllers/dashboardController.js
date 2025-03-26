import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAppointments = await Appointment.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenueResult = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;

  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.product", totalSold: { $sum: "$items.quantity" } } },
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

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt");
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).select("totalPrice createdAt");

  res.status(200).json({
    totalUsers,
    totalAppointments,
    totalOrders,
    totalRevenue,
    topProducts,
    recentUsers,
    recentOrders,
  });
});
