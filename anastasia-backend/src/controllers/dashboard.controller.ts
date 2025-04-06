// src/controllers/dashboard.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.models";
import Order from "../models/order.models";
import Appointment from "../models/appointment.models";
import Product from "../models/product.models";
import Blog from "../models/blog.models";
import Feedback from "../models/feedback.models";
import Coupon from "../models/coupon.models";
import Email from "../models/email.models";
import Gallery from "../models/gallery.models";
import Service from "../models/service.models";
import Notification from "../models/notification.models";
import ContactMessage from "../models/contactMessage.models";


// ✅ Get admin dashboard stats
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const [
    userCount,
    orderCount,
    productCount,
    appointmentCount,
    blogCount,
    feedbackCount,
    couponCount,
    emailCount,
    galleryCount,
    serviceCount,
    contactCount,
    notificationCount,
  ] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Appointment.countDocuments(),
    Blog.countDocuments(),
    Feedback.countDocuments(),
    Coupon.countDocuments(),
    Email.countDocuments(),
    Gallery.countDocuments(),
    Service.countDocuments(),
    ContactMessage.countDocuments(),
    Notification.countDocuments(),
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
    feedbacks: feedbackCount,
    coupons: couponCount,
    emails: emailCount,
    gallery: galleryCount,
    services: serviceCount,
    contactMessages: contactCount,
    notifications: notificationCount,
  });
});


