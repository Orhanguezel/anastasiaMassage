import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
  togglePublishFeedback,
  deleteFeedback,
} from "../controllers/feedback.controller";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", createFeedback);
router.get("/", authenticate, authorizeRoles("admin"), getAllFeedbacks);
router.patch("/:id/toggle", authenticate, authorizeRoles("admin"), togglePublishFeedback);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteFeedback);

export default router;
