import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Public Endpoints
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// ✅ Admin Endpoints
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.uploadType = "product"; // farklı klasör
    next();
  },
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.uploadType = "product";
    next();
  },
  upload.single("image"),
  updateProduct
);

router.delete("/:id", authenticate, authorizeRoles("admin"), deleteProduct);

export default router;
