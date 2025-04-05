// src/routes/stock.routes.ts

import express from "express";
import {
  createStock,
  getAllStocks,
  deleteStock,
} from "../controllers/stock.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Admin routes
router.post("/", authenticate, authorizeRoles("admin"), createStock);
router.get("/", authenticate, authorizeRoles("admin"), getAllStocks);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteStock);

export default router;
