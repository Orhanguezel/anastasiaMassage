import express from "express";
import userRoutes from "./userRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import blogRoutes from "./blogRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = express.Router();


router.use("/user", userRoutes);
router.use("/appointments", appointmentRoutes); // 📌 burası eklendi
router.use("/products", productRoutes); // ✅ eklendi
router.use("/orders", orderRoutes); // ✅ eklendi
router.use("/blogs", blogRoutes); // ✅ eklendi
router.use("/dashboard", dashboardRoutes); // ✅ eklendi




export default router;
