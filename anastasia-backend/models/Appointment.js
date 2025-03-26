import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true }, // müşteri adı
  email: { type: String, required: true },
  phone: { type: String },
  serviceType: { type: String, required: true }, // masaj türü
  note: { type: String },
  date: { type: String, required: true }, // "2025-03-24"
  time: { type: String, required: true }, // "13:00"
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Appointment", appointmentSchema);
