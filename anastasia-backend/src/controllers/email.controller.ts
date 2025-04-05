import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../services/emailService";
import MailMessage from "../models/email.models";
import { readInboxEmails } from "../services/emailReader";
import mongoose from "mongoose";


export const sendTestEmail = asyncHandler(async (req: Request, res: Response) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    res.status(400).json({ message: "Please provide to, subject and message" });
    return;
  }

  const html = `
    <h2>${subject}</h2>
    <p>${message}</p>
    <br/>
    <small>Bu e-posta Anastasia Masaj Salonu sistemi üzerinden gönderilmiştir.</small>
  `;

  await sendEmail({ to, subject, html });

  res.status(200).json({ success: true, message: "E-posta başarıyla gönderildi." });
});

  export const getAllMails = asyncHandler(async (_req: Request, res: Response) => {
    const mails = await MailMessage.find().sort({ createdAt: -1 });
    res.json(mails);
  });

  export const getMailById = asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: "Ungültige Mail-ID" });
      return;
    }
  
    const mail = await MailMessage.findById(req.params.id);
    if (!mail) {
      res.status(404).json({ message: "Mail wurde nicht gefunden." });
      return;
    }
    res.json(mail);
  });

  export const deleteMail = asyncHandler(async (req: Request, res: Response) => {
    const mail = await MailMessage.findByIdAndDelete(req.params.id);
    if (!mail) {
      res.status(404).json({ message: "Mail not found" });
      return;
    }
    res.json({ message: "Mail deleted successfully" });
  });


export const fetchEmailsManually = asyncHandler(async (_req, res) => {
  readInboxEmails();
  res.json({ message: "Neue E-Mails werden geprüft..." });
});


export const markAsReadOrUnread = asyncHandler(async (req, res) => {
  const { isRead } = req.body;
  const mail = await MailMessage.findById(req.params.id);
  if (!mail) {
    res.status(404).json({ message: "Nachricht nicht gefunden." });
    return;
  }

  mail.isRead = isRead;
  await mail.save();
  res.json({ message: `Nachricht als ${isRead ? "gelesen" : "ungelesen"} markiert.`, mail });
});

