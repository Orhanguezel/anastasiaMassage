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

router.get("/me", authenticate, getMyProfile);
router.put("/me/update", authenticate, updateMyProfile);
router.put("/me/password", authenticate, updateMyPassword);
router.patch("/me/notifications", authenticate, updateNotificationSettings);
router.patch("/me/social", authenticate, updateSocialMediaLinks);


export default router;
