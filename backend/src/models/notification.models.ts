// src/models/notification.models.ts

import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  user?: Types.ObjectId;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<INotification>("Notification", notificationSchema);
