// src/routes/blog.routes.ts

import express, { Request, Response, NextFunction } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

// Admin routes
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  (req, _res, next) => {
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
  (req, _res, next) => {
    req.uploadType = "blog";
    next();
  },
  upload.single("image"),
  updateBlog
);

router.delete("/:id", authenticate, authorizeRoles("admin"), deleteBlog);

export default router;
