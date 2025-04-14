import { Schema, model, Types, Document } from "mongoose";

export interface IChatMessage extends Document {
  sender: Types.ObjectId;
  roomId: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: String, required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true } // ✅ Bu, createdAt ve updatedAt'i otomatik ekler
);

export default model<IChatMessage>("ChatMessage", chatMessageSchema);
