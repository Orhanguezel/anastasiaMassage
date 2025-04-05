import express from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";
import {
  upsertSetting,
  getAllSettings,
  deleteSetting,
} from "../controllers/settings.controller";

const router = express.Router();

router.get("/", authenticate, authorizeRoles("admin"), getAllSettings);
router.post("/", authenticate, authorizeRoles("admin"), upsertSetting);
router.delete("/:key", authenticate, authorizeRoles("admin"), deleteSetting);

export default router;
