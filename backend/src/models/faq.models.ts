import { Schema, model, Document } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const faqSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IFAQ>("FAQ", faqSchema);
