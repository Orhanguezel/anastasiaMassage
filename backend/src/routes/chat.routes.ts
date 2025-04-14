import express from "express";
import {
  getMessagesByRoom,
  getAllRoomsLastMessages,
  deleteMessage,
  deleteMessagesBulk,
  sendManualMessage,
} from "../controllers/chat.controller";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Belirli odadaki tüm mesajlar
router.get("/:roomId", authenticate, getMessagesByRoom);

// ✅ Admin işlemleri
router.get("/", authenticate, authorizeRoles("admin"), getAllRoomsLastMessages);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteMessage);
router.post("/bulk", authenticate, authorizeRoles("admin"), deleteMessagesBulk);
router.post("/manual", authenticate, authorizeRoles("admin"), sendManualMessage);

export default router;
