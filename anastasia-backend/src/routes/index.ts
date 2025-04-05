// src/routes/index.ts

import express, { Router } from "express";
import userRoutes from "./user.routes";
import appointmentRoutes from "./appointment.routes";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";
import blogRoutes from "./blog.routes";
import dashboardRoutes from "./dashboard.routes";
import cartRoutes from "./cart.routes";
import notificationRoutes from "./notification.routes";
import feedbackRoutes from "./feedback.routes";
import couponRoutes from "./coupon.routes";
import settingsRoutes from "./settings.routes";
import contactRoutes from "./contact.routes";
import galleryRoutes from "./gallery.routes";
import faqRoutes from "./faq.routes";
import stockRoutes from "./stock.routes";
import paymentRoutes from "./payment.routes";
import accountRoutes from "./account.routes";
import servicesRoutes from "./services.routes";
import emailRoutes from "./email.routes";

const router: Router = express.Router();

router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/blogs", blogRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/cart", cartRoutes);
router.use("/notifications", notificationRoutes);
router.use("/feedbacks", feedbackRoutes);
router.use("/coupons", couponRoutes);
router.use("/contacts", contactRoutes);
router.use("/settings", settingsRoutes);
router.use("/faqs", faqRoutes);
router.use("/gallery", galleryRoutes);
router.use("/stocks", stockRoutes);
router.use("/payments", paymentRoutes);
router.use("/account", accountRoutes);
router.use("/services", servicesRoutes);
router.use("/emails", emailRoutes);


export default router;

