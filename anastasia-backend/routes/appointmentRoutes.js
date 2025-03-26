import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Randevu oluştur (herkes)
router.post("/", createAppointment);

// 📌 Admin yetkili işlemler
router.get("/", authenticate, authorizeRoles("admin"), getAllAppointments);
router.get("/:id", authenticate, authorizeRoles("admin"), getAppointmentById);
router.put("/:id/status", authenticate, authorizeRoles("admin"), updateAppointmentStatus);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteAppointment);

export default router;
