import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  changePassword,
  updateUserRole,
  toggleUserStatus,
  updateUser
} from "../controllers/userController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ Dosya yükleme middleware

const router = express.Router();

// ✅ Kullanıcı Kayıt (Profil Resmi ile)
router.post("/register", registerUser);




// ✅ Kullanıcı Girişi
router.post("/login", loginUser);

router
  .route("/profile")
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile);

// ✅ Kullanıcı Şifre Değiştirme
router.post("/change-password", authenticate, changePassword);

// ✅ Tüm Kullanıcıları Listeleme (Admin)
router.get("/users", authenticate, authorizeRoles("admin"), getUsers);

// ✅ Kullanıcı Getirme, Güncelleme ve Silme (Admin)
router
  .route("/users/:id")
  .get(authenticate, authorizeRoles("admin"), getUserById)
  .put(
    authenticate,
    authorizeRoles("admin"),
    (req, res, next) => {
      req.uploadType = "profile"; // ✅ Profil resmini doğru klasöre kaydet
      next();
    },
    upload.single("profileImage"), // ✅ Dosya yükleme middleware'i
    updateUser
  )
  .delete(authenticate, authorizeRoles("admin"), deleteUser);

// ✅ Kullanıcı Rolünü Güncelleme (Admin)
router.put("/users/:id/role", authenticate, authorizeRoles("admin"), updateUserRole);

// ✅ Kullanıcı Aktif/Pasif Durumunu Güncelleme (Admin)
router.put("/users/:id/status", authenticate, authorizeRoles("admin"), toggleUserStatus);

 //📌 Kullanıcı Profil Resmi Güncelleme (Herkes)

router.put(
  "/users/:id",
  authenticate,
  authorizeRoles("admin"),
  (req, res, next) => {
    req.uploadType = "profile"; // uploadMiddleware.js'deki uploadType'ı tanımladık
    next();
  },
  upload.single("profileImage"),
  updateUser
);


export default router;
