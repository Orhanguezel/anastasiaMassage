import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authenticate, authorizeRoles("admin"), getDashboardStats);

export default router;

