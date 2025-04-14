import express from "express";
import {
  createFAQ,
  getAllFAQs,
  deleteFAQ,
  updateFAQ,
} from "../controllers/faq.controller";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// Public
router.get("/", getAllFAQs);

// Admin
router.post("/", authenticate, authorizeRoles("admin"), createFAQ);
router.put("/:id", authenticate, authorizeRoles("admin"), updateFAQ); // 🔄 güncelleme
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteFAQ);

export default router;
