import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentByOrderId,
  markPaymentAsPaid,
} from "../controllers/payment.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createPayment);
router.get("/", authenticate, authorizeRoles("admin"), getAllPayments);
router.get("/order/:orderId", authenticate, getPaymentByOrderId);
router.put("/:id/mark-paid", authenticate, authorizeRoles("admin"), markPaymentAsPaid);

export default router;
