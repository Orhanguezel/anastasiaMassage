import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";
import {
  upsertSetting,
  getAllSettings,
  deleteSetting,
  getSettingByKey,
} from "../controllers/settings.controller";

const router = express.Router();

// Admin Routes
router.get("/", authenticate, authorizeRoles("admin"), getAllSettings);
router.get("/:key", authenticate, authorizeRoles("admin"), getSettingByKey);
router.post("/", authenticate, authorizeRoles("admin"), upsertSetting);
router.delete("/:key", authenticate, authorizeRoles("admin"), deleteSetting);

export default router;
