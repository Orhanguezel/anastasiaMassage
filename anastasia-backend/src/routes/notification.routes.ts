// src/routes/notification.routes.ts

import express from "express";
import {
  createNotification,
  getAllNotifications,
  deleteNotification,
} from "../controllers/notification.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Admin: Get all notifications
router.get("/", authenticate, authorizeRoles("admin"), getAllNotifications);

// ✅ Admin: Create new notification
router.post("/", authenticate, authorizeRoles("admin"), createNotification);

// ✅ Admin: Delete notification
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteNotification);

export default router;

