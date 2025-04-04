import express, { Request, Response, NextFunction } from "express";
import {
  createOrder,
  getAllOrders,
  markOrderAsDelivered,
  updateOrderStatus,
} from "../controllers/order.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Create Order (optional: if user is authenticated, attach user)
router.post("/", authenticate, createOrder);

// ✅ Admin Endpoints
router.get("/", authenticate, authorizeRoles("admin"), getAllOrders);

router.put(
  "/:id/deliver",
  authenticate,
  authorizeRoles("admin"),
  markOrderAsDelivered
);

router.put(
  "/:id/status",
  authenticate,
  authorizeRoles("admin"),
  updateOrderStatus
);

export default router;
