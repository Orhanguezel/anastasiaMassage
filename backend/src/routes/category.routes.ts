// src/routes/category.routes.ts

import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// Public
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin-only
router.post("/", authenticate, authorizeRoles("admin"), createCategory);
router.put("/:id", authenticate, authorizeRoles("admin"), updateCategory);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteCategory);

export default router;
