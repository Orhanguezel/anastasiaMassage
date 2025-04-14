import express from "express";
import {
  createStock,
  getAllStocks,
  getStockByProductId,
  updateStock,
  deleteStock,
} from "../controllers/stock.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Admin routes
router.post("/", authenticate, authorizeRoles("admin"), createStock);
router.get("/", authenticate, authorizeRoles("admin"), getAllStocks);
router.get("/product/:productId", authenticate, authorizeRoles("admin"), getStockByProductId);
router.put("/:id", authenticate, authorizeRoles("admin"), updateStock);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteStock);

export default router;
