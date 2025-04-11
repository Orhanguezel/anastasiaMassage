import { Schema, model, Document } from "mongoose";

export interface IFeedback extends Document {
  name: string;
  email: string;
  message: string;
  rating?: number;
  isPublished: boolean;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IFeedback>("Feedback", feedbackSchema);
