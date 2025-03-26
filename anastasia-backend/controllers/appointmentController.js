import Appointment from "../models/Appointment.js";
import asyncHandler from "express-async-handler";

// 📌 Randevu Oluştur
export const createAppointment = asyncHandler(async (req, res) => {
  const { name, email, phone, serviceType, note, date, time } = req.body;

  if (!name || !email || !serviceType || !date || !time) {
    return res.status(400).json({ message: "Lütfen gerekli tüm alanları doldurun." });
  }

  const appointment = await Appointment.create({
    name,
    email,
    phone,
    serviceType,
    note,
    date,
    time,
  });

  res.status(201).json({
    success: true,
    message: "✅ Randevunuz başarıyla oluşturuldu.",
    appointment,
  });
});

// 📌 Tüm Randevuları Listele (Admin)
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find().sort({ createdAt: -1 });
  res.status(200).json(appointments);
});

// 📌 Tek Randevu Getir
export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Randevu bulunamadı." });
  }
  res.json(appointment);
});

// 📌 Randevu Durumu Güncelle
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Randevu bulunamadı." });
  }

  appointment.status = status;
  await appointment.save();

  res.json({ message: "✅ Randevu durumu güncellendi.", appointment });
});

// 📌 Randevu Sil
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Randevu zaten silinmiş olabilir." });
  }

  res.json({ message: "🗑️ Randevu silindi." });
});
