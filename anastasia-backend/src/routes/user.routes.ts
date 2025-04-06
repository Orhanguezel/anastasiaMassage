import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  logoutUser,
} from "../controllers/user/auth.controller";

import {
  getUserProfile,
  updateUserProfile,
  updateProfileImage,
} from "../controllers/user/profile.controller";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user/crud.controller";

import {
  updateUserRole,
  toggleUserStatus,
} from "../controllers/user/status.controller";

import { authenticate, authorizeRoles } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

// 🔐 Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authenticate, changePassword);

// 👤 Profile
router
  .route("/profile")
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile);

// 🖼️ Profile Image Upload (optional: separate or admin usage)
router.put(
  "/users/:id/profile-image",
  authenticate,
  (req, res, next) => {
    req.uploadType = "profile";
    next();
  },
  upload.single("profileImage"),
  updateProfileImage
);

// 📋 Admin Routes
router.get("/users", authenticate, authorizeRoles("admin"), getUsers);

router
  .route("/users/:id")
  .get(authenticate, authorizeRoles("admin"), getUserById)
  .put(
    authenticate,
    authorizeRoles("admin"),
    (req, res, next) => {
      req.uploadType = "profile";
      next();
    },
    upload.single("profileImage"),
    updateUser
  )
  .delete(authenticate, authorizeRoles("admin"), deleteUser);

router.put(
  "/users/:id/role",
  authenticate,
  authorizeRoles("admin"),
  updateUserRole
);

router.put(
  "/users/:id/status",
  authenticate,
  authorizeRoles("admin"),
  toggleUserStatus
);

router.post("/logout", logoutUser);

export default router;
