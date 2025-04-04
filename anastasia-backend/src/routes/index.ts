import express, { Router } from "express";
import userRoutes from "./user.routes";
import appointmentRoutes from "./appointment.routes";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";
import blogRoutes from "./blog.routes";
import dashboardRoutes from "./dashboard.routes";
import cartRoutes from "./cart.routes";

const router: Router = express.Router();

router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/blogs", blogRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/cart", cartRoutes);


export default router;
