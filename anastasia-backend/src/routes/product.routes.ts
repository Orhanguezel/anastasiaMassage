// src/routes/product.routes.ts
import express, { Request, Response, NextFunction } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

// Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  (req: Request, _res: Response, next: NextFunction) => {
    req.uploadType = "product";
    next();
  },
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  (req: Request, _res: Response, next: NextFunction) => {
    req.uploadType = "product";
    next();
  },
  upload.single("image"),
  updateProduct
);

router.delete("/:id", authenticate, authorizeRoles("admin"), deleteProduct);

export default router;
