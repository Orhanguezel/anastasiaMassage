import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  updateNotificationSettings,
  updateSocialMediaLinks,
} from "../controllers/account.controller";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// 💡 Authenticated kullanıcıya ait veriler
router.get("/me", authenticate, getMyProfile);

// 💡 Profil bilgileri güncelleme
router.put("/me/update", authenticate, updateMyProfile);

// 💡 Şifre güncelleme
router.put("/me/password", authenticate, updateMyPassword);

// 💡 Bildirim ayarlarını güncelleme
router.patch("/me/notifications", authenticate, updateNotificationSettings);

// 💡 Sosyal medya linklerini güncelleme
router.patch("/me/social", authenticate, updateSocialMediaLinks);

export default router;
