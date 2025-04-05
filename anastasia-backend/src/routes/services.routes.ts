import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

// 🌿 Public routes
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// 🛠 Admin routes
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  (req, _res, next) => {
    req.uploadType = "service";
    next();
  },
  upload.array("images", 5), 
  createService
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, _res, next) => {
    req.uploadType = "service";
    next();
  },
  upload.array("images", 5),
  updateService
);

router.delete("/:id", authenticate, authorizeRoles("admin"), deleteService);

export default router;
