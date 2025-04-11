// src/controllers/appointment.controller.ts

import { sendEmail } from "../services/emailService";
import Appointment from "../models/appointment.models";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { appointmentConfirmationTemplate } from "../templates/appointmentConfirmation";
import Notification from "../models/notification.models";


export const createAppointment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, serviceType, note, date, time, service } = req.body;

  if (!name || !email || !serviceType || !date || !time || !service) {
    res.status(400).json({ message: "Bitte füllen Sie alle erforderlichen Felder aus." });
    return;
  }

  // 📝 Appointment in DB speichern
  const appointment = await Appointment.create({
    name,
    email,
    phone,
    serviceType,
    note,
    date,
    time,
    service,
  });

  // 📧 E-Mail an Kunden
  const htmlToCustomer = appointmentConfirmationTemplate({
    name,
    service: serviceType,
    date,
    time,
  });

  // 📧 E-Mail an Admin
  const htmlToAdmin = `
    <h2>📬 Neuer Termin eingegangen</h2>
    <p>Folgender Termin wurde gebucht:</p>
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

  // ✅ E-Mail an Kunde senden
  await sendEmail({
    to: email,
    subject: "🗓️ Terminbestätigung – Anastasia Massage",
    html: htmlToCustomer,
  });

  // ✅ E-Mail an Admin senden
  await sendEmail({
    to: process.env.SMTP_FROM || "admin@example.com",
    subject: "🆕 Neuer Termin – Anastasia Massage",
    html: htmlToAdmin,
  });

  res.status(201).json({
    success: true,
    message: "Termin wurde erfolgreich erstellt.",
    appointment,
  });

  await Notification.create({
    title: "Neuer Termin gebucht",
    message: `${name} hat einen Termin für ${serviceType} am ${date} um ${time} gebucht.`,
    type: "info",
    user: null,
  });
  


});


export const getAllAppointments = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const appointments = await Appointment.find()
    .populate("service")
    .sort({ createdAt: -1 });

  res.status(200).json(appointments);
});

export const getAppointmentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const appointment = await Appointment.findById(req.params.id).populate("service");
  if (!appointment) {
    res.status(404).json({ message: "Appointment not found." });
    return;
  }
  res.json(appointment);
});


// Update appointment status
export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404).json({ message: "Appointment not found." });
    return;
  }

  appointment.status = status;
  await appointment.save();

  res.json({ message: "Appointment status updated.", appointment });
});

// Delete appointment
export const deleteAppointment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) {
    res.status(404).json({ message: "Appointment might have already been deleted." });
    return;
  }

  res.json({ message: "Appointment deleted." });
});
