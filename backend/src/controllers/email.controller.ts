import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import MailMessage, { IMailMessage } from "../models/email.models";
import { sendEmail } from "../services/emailService";
import { readInboxEmails } from "../services/emailReader";
import { isValidObjectId } from "../utils/validation";

// ✅ Test e-posta gönder (Admin)
export const sendTestEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { to, subject, message }: { to: string; subject: string; message: string } = req.body;

  if (!to || !subject || !message) {
    res.status(400).json({ message: "Please provide 'to', 'subject' and 'message'." });
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

// ✅ Tüm mailleri getir
export const getAllMails = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const mails = await MailMessage.find().sort({ createdAt: -1 });
  res.status(200).json(mails);
});

// ✅ ID ile tek mail getir
export const getMailById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Ungültige Mail-ID" });
    return;
  }

  const mail = await MailMessage.findById(id);
  if (!mail) {
    res.status(404).json({ message: "Mail wurde nicht gefunden." });
    return;
  }

  res.status(200).json(mail);
});

// ✅ Mail sil
export const deleteMail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid mail ID" });
    return;
  }

  const mail = await MailMessage.findByIdAndDelete(id);
  if (!mail) {
    res.status(404).json({ message: "Mail not found" });
    return;
  }

  res.status(200).json({ message: "Mail deleted successfully" });
});

// ✅ Manuel olarak yeni mailleri kontrol et
export const fetchEmailsManually = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  await readInboxEmails(); // async olabilir!
  res.status(200).json({ message: "Neue E-Mails werden geprüft..." });
});

// ✅ Maili okundu/okunmadı olarak işaretle
export const markAsReadOrUnread = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { isRead }: { isRead: boolean } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid mail ID" });
    return;
  }

  const mail = await MailMessage.findById(id);
  if (!mail) {
    res.status(404).json({ message: "Nachricht nicht gefunden." });
    return;
  }

  mail.isRead = isRead;
  await mail.save();

  res.status(200).json({
    message: `Nachricht als ${isRead ? "gelesen" : "ungelesen"} markiert.`,
    mail,
  });
});
