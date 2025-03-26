import express from "express";
import {
  createOrder,
  getAllOrders,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Sipariş Oluştur (giriş gerekmez ama token varsa kullanıcı atanır)
router.post("/", authenticate, createOrder); // guest kullanıcılar için middleware opsiyonel

// ✅ Admin Endpoints
router.get("/", authenticate, authorizeRoles("admin"), getAllOrders);
router.put("/:id/deliver", authenticate, authorizeRoles("admin"), markOrderAsDelivered);

export default router;
