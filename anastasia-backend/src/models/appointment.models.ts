// src/models/Appointment.ts

import { Schema, model, Document } from "mongoose";

export interface IAppointment extends Document {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  note?: string;
  date: string;
  time: string;
  service: Schema.Types.ObjectId;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  serviceType: { type: String, required: true },
  note: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: Schema.Types.ObjectId, ref: "Service", required: true },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default model<IAppointment>("Appointment", appointmentSchema);
