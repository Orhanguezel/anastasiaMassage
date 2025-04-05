import express from "express";
import {
  createFAQ,
  getAllFAQs,
  deleteFAQ,
} from "../controllers/faq.controller";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getAllFAQs);

router.post("/", authenticate, authorizeRoles("admin"), createFAQ);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteFAQ);

export default router;
