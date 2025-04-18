// src/routes/mail.routes.ts

import express from "express";
import { 
    getAllMails, 
    getMailById, 
    deleteMail, 
    sendTestEmail,
    fetchEmailsManually,
    markAsReadOrUnread
 } from "../controllers/email.controller";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticate, authorizeRoles("admin"));
router.post("/send", sendTestEmail); 
router.get("/", getAllMails);
router.get("/fetch", authenticate, authorizeRoles("admin"), fetchEmailsManually);
router.get("/:id", getMailById);
router.delete("/:id", deleteMail);
router.patch("/:id/read", authenticate, markAsReadOrUnread);


export default router;

