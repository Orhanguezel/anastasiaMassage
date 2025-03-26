import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authenticate, authorizeRoles("admin"), getDashboardStats);

export default router;
