import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import dayjs from "dayjs";
import Appointment from "../models/appointment.models";
import Notification from "../models/notification.models";
import { sendEmail } from "../services/emailService";
import { appointmentConfirmationTemplate } from "../templates/appointmentConfirmation";
import { isValidObjectId } from "../utils/validation";

// ✅ Randevu Oluştur
export const createAppointment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, serviceType, note, date, time, service, durationMinutes = 60 } = req.body;

  if (!name || !email || !serviceType || !date || !time || !service) {
    res.status(400).json({ message: "Bitte füllen Sie alle erforderlichen Felder aus." });
    return;
  }

  const start = dayjs(`${date}T${time}`);
  const end = start.add(durationMinutes, "minute");

  // ⛔ Zaman çakışması kontrolü
  const existingAppointment = await Appointment.findOne({
    date,
    $expr: {
      $and: [
        {
          $lt: [
            { $toDate: { $concat: ["$date", "T", "$time"] } },
            end.toDate(),
          ],
        },
        {
          $gt: [
            {
              $toDate: {
                $dateAdd: {
                  startDate: { $concat: ["$date", "T", "$time"] },
                  unit: "minute",
                  amount: "$durationMinutes",
                },
              },
            },
            start.toDate(),
          ],
        },
      ],
    },
  });

  if (existingAppointment) {
    res.status(409).json({ message: "Bu tarih ve saatte zaten bir randevu var." });
    return;
  }

  // ✅ Randevuyu oluştur
  const appointment = await Appointment.create({
    user: req.user?.id || undefined,
    name,
    email,
    phone,
    serviceType,
    note,
    date,
    time,
    service,
    durationMinutes,
  });

  // ✅ E-posta içerikleri
  const htmlToCustomer = appointmentConfirmationTemplate({ name, service: serviceType, date, time });

  const htmlToAdmin = `
    <h2>📬 Neuer Termin eingegangen</h2>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>E-Mail:</strong> ${email}</li>
      <li><strong>Telefon:</strong> ${phone || "-"}</li>
      <li><strong>Behandlung:</strong> ${serviceType}</li>
      <li><strong>Datum:</strong> ${date}</li>
      <li><strong>Uhrzeit:</strong> ${time}</li>
      <li><strong>Notiz:</strong> ${note || "-"}</li>
    </ul>
    <p>✉️ Bitte überprüfen Sie das Admin-Panel für weitere Details.</p>
  `;

  await Promise.all([
    sendEmail({
      to: email,
      subject: "🗓️ Terminbestätigung – Anastasia Massage",
      html: htmlToCustomer,
    }),
    sendEmail({
      to: process.env.SMTP_FROM || "admin@example.com",
      subject: "🆕 Neuer Termin – Anastasia Massage",
      html: htmlToAdmin,
    }),
  ]);

  res.status(201).json({
    success: true,
    message: "Termin wurde erfolgreich erstellt.",
    appointment,
  });

  // 🔔 Bildirim oluştur
  void Notification.create({
    title: "Neuer Termin gebucht",
    message: `${name} hat einen Termin für ${serviceType} am ${date} um ${time} gebucht.`,
    type: "info",
    user: req.user?.id || null,
  });
});

// ✅ Tüm randevuları getir
export const getAllAppointments = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const appointments = await Appointment.find()
    .populate("service")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(appointments);
});

// ✅ Tek randevuyu getir
export const getAppointmentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid appointment ID" });
    return;
  }

  const appointment = await Appointment.findById(id).populate("service");
  if (!appointment) {
    res.status(404).json({ message: "Appointment not found." });
    return;
  }

  res.status(200).json(appointment);
});

// ✅ Randevu durumunu güncelle
export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid appointment ID" });
    return;
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    res.status(404).json({ message: "Appointment not found." });
    return;
  }

  appointment.status = status;
  await appointment.save();

  res.status(200).json({
    message: "Appointment status updated.",
    appointment,
  });
});

// ✅ Randevuyu sil
export const deleteAppointment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid appointment ID" });
    return;
  }

  const appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) {
    res.status(404).json({ message: "Appointment might have already been deleted." });
    return;
  }

  res.status(200).json({ message: "Appointment deleted." });
});
