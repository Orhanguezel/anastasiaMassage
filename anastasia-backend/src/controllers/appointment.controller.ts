// src/controllers/appointment.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Appointment from "../models/appointment.models";

// Create new appointment (public)
export const createAppointment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, serviceType, note, date, time } = req.body;

  if (!name || !email || !serviceType || !date || !time) {
    res.status(400).json({ message: "Please fill in all required fields." });
    return;
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
    message: "Appointment created successfully.",
    appointment,
  });
});

// Get all appointments (admin only)
export const getAllAppointments = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const appointments = await Appointment.find().sort({ createdAt: -1 });
  res.status(200).json(appointments);
});

// Get appointment by ID
export const getAppointmentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const appointment = await Appointment.findById(req.params.id);
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
