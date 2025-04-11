import express from "express";
import {
  uploadGalleryItem,
  getAllGalleryItems,
  deleteGalleryItem,
} from "../controllers/gallery.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

router.get("/", getAllGalleryItems);

router.post(
  "/upload",
  authenticate,
  authorizeRoles("admin"),
  (req, _res, next) => {
    req.uploadType = "gallery";
    next();
  },
  upload.single("image"),
  uploadGalleryItem
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteGalleryItem
);

export default router;
