import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Public
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

// ✅ Admin
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.uploadType = "blog";
    next();
  },
  upload.single("image"),
  createBlog
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.uploadType = "blog";
    next();
  },
  upload.single("image"),
  updateBlog
);

router.delete("/:id", authenticate, authorizeRoles("admin"), deleteBlog);

export default router;
